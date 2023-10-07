import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";

// Define the User Schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: [true, "Username must be unique."],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long."],
      maxlength: [20, "Username cannot be more than 20 characters long."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email must be unique."],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format."],
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
    },

    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    subscription: {
      id: String,
      status: String,
    },

    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },

  {
    timestamps: true,
  }
);

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);

    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// generate jwt token
userSchema.methods.generateToken = async function () {
  try {
    return JWT.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
        subscription: this.subscription
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  } catch (error) {
    throw error;
  }
};

// method to compare hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw error;
  }
};

// method to generate reset password token
userSchema.methods.generateResetToken = async function () {
  try {
    const token = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

    return token;
  } catch (error) {
    throw error;
  }
};

// Create a User model based on the schema
const User = model("User", userSchema);

export default User;
