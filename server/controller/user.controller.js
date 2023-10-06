import { config } from "dotenv";
import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import generateDefaultAvatar from "../utils/avatar.util.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";
import path from "path";
import sendEmail from "../utils/email.util.js";
import emailTemplate from "../utils/template.util.js";
import crypto from "crypto";

// load enviroment variables
config();

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // Valid for 7 days
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
  secure: process.env.NODE_ENV === "Development" ? false : true,
};

// function to create or register user
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(new AppError("Email already exists", 400));
    }

    // create new user instance
    const user = await User.create({
      username,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url: "http://dummyurl.com",
      },
    });

    // Generate default avatar
    const defaultAvatarBuffer = await generateDefaultAvatar(username);

    // create a temporary file from the buffer
    const tempFilePath = path.join(process.cwd(), "temp_avatar.png");

    await fs.writeFile(tempFilePath, defaultAvatarBuffer);

    // upload default avatar to Cloudinary
    try {
      const uploadAvatarResult = await cloudinary.v2.uploader.upload(
        tempFilePath,
        {
          folder: "PW_Users",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        }
      );

      if (!uploadAvatarResult) {
        next(new AppError("File upload failed, please try again", 500));
      }

      user.avatar.public_id = uploadAvatarResult.public_id;
      user.avatar.secure_url = uploadAvatarResult.secure_url;

      await user.save();
    } catch (error) {
      // Handle the error and pass it to the error-handling middleware
      return next(new AppError("Error while uploading avatar", 500));
    } finally {
      // delete the temporary file
      fs.unlink(tempFilePath);
    }

    user.password = undefined;

    // generating JWT token
    const token = await user.generateToken();

    res.cookie("token", token, cookieOptions);

    // respond with success message and user details
    res.status(201).json({
      success: true,
      message: "Registered successfully!",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message || "Failed to registerd user", 500));
  }
};

// function to login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Email or password doesn't match", 400));
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return next(new AppError("Email or password doesn't match", 400));
    }

    const token = await user.generateToken();

    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message || "Failed to login", 500));
  }
};

// function to logout user
const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
      maxAge: 0,
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    return next(new AppError());
  }
};

// function to get user profile or details
const getProfile = async (req, res, next) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      message: "User details fetched successfully!",
      user,
    });
  } catch (error) {
    return next(new AppError("Failed to fetch user details", 500));
  }
};

// function to edit profile
const editProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const id = req.user.id;

    const user = await User.findById(id);

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    // update avatar
    if (req.file) {
      try {
        // remove old avatar from cloudinary
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        // upload new avatar
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "PW_Users",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          // remove file from the server
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next("File not uploaded, please try again later", 500);
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user,
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Failed to update profile details", 500)
    );
  }
};

// function to initiate forgot password process
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    const emailExists = await User.findOne({ email });

    if (!emailExists) {
      return next(new AppError("Email is not registered", 400));
    }

    const resetToken = await emailExists.generateResetToken();

    await emailExists.save();

    // create forgot password url to send on email
    const forgotPasswordURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const { subject, message } = emailTemplate(
      forgotPasswordURL,
      emailExists.username
    );

    try {
      await sendEmail(email, subject, message);

      res.status(200).json({
        success: true,
        message: `Email sent to ${emailExists.email} successfully`,
      });
    } catch (error) {
      emailExists.resetPasswordToken = undefined;
      emailExists.resetPasswordExpiry = undefined;

      await emailExists.save();

      return next(
        new AppError(
          error.message || "Error in sending reset password email",
          500
        )
      );
    }
  } catch (error) {
    return next(
      new AppError(error.message || "Failed to send reset password URL", 500)
    );
  }
};

// function to reset password
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return next(new AppError("All fields are required", 400));
    }

    if (password !== confirmPassword) {
      return next(new AppError("Passwords don't match", 400));
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return next(
        new AppError("Token is invalid or expired, please try again", 400)
      );
    }

    // Check if the new password is the same as the old password
    if (password === user.password) {
      return next(
        new AppError(
          "Please choose a different password. You have previously used this password.",
          400
        )
      );
    }

    // Update the user's password
    user.password = password;
    user.resetPasswordExpiry = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Error while resetting password", 500)
    );
  }
};

// function to change password
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!oldPassword || !newPassword) {
      return next(new AppError("All fields are mandatory.", 400));
    }

    const user = await User.findById(id).select("+password");

    if (!user) {
      return next(new AppError("User not found.", 400));
    }

    const isPasswordMatch = await user.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return next(new AppError("Old password doesn't match", 400));
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    return next(new AppError("Error while changing password", 500));
  }
};

export {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};
