import AppError from "../utils/error.util.js";
import sendEmail from "../utils/email.util.js"
import User from "../models/user.model.js";


// function to send email from client to contact us authority
const contactUs = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        // Checking if values are valid
        if (!name || !email || !message) {
          return next(new AppError("Name, Email, Message are required"));
        }

        try {
          const subject = "Contact Us Form";
          const textMessage = `${name} - ${email} <br /> ${message}`;

          // Await the send email
          await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);
        } catch (error) {
          console.log(error);
          return next(new AppError(error.message, 400));
        }

        res.status(200).json({
          success: true,
          message: "Your request has been submitted successfully",
        });
    } catch (error) {
        return next(
            new AppError(
                error.message , 500
            )
        )
    }
}

// function to get user stats or count
const userStats = async (req, res, next) => {
    try {
        const allUsersCount = await User.countDocuments();

        const subscribedUsersCount = await User.countDocuments({
          "subscription.status": "active", // subscription.status means we are going inside an object and we have to put this in quotes
        });

        res.status(200).json({
          success: true,
          message: "All registered users count",
          allUsersCount,
          subscribedUsersCount,
        });
    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

export { contactUs, userStats };