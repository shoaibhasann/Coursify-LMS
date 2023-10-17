import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { razorpayInstance } from "../server.js";
import AppError from "../utils/error.util.js";
import crypto from "crypto";

// function to send razorpay api key
const getRazorpayKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Api Key send successfully!",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(new AppError("Error while sending api key", 500));
  }
};

// function to buy subscription
const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const userExists = await User.findById(id);

    if (!userExists) {
      return next(new AppError("Unauthorized, please login first.", 400));
    }

    if (userExists.role === "admin") {
      return next(new AppError("Admin can't subscribe, Sorry!"));
    }

    // add free 15 days trial for subscription
    const startDate = new Date();

    startDate.setDate(startDate.getDate() + 15);

    // generating subscription ID
    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
      total_count: 1,
      start_at: Math.floor(startDate / 1000),
    });

    userExists.subscription.id = subscription.id;
    userExists.subscription.status = subscription.status;

    await userExists.save();

    res.status(200).json({
      success: true,
      message: "Enjoy, Subscribed successfully!",
      subscription_id: subscription.id,
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Error while creating subscripton", 500)
    );
  }
};

// function to verify payment of subscription
const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = req.body;

    const userExists = await User.findById(id);

    if (!userExists) {
      return next(new AppError("Unauthorized, please login first.", 400));
    }

    const subscriptionID = userExists.subscription.id;

    const generateSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${subscriptionID}`)
      .digest("hex");

    if (generateSignature !== razorpay_signature) {
      return next(new AppError("Payment failed, please try again.", 400));
    }

    // create payment record
    await Payment.create({
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    });

    // update subscription status of user
    userExists.subscription.status = "active";
    await userExists.save();

    res.status(200).json({
      success: true,
      message: "Thank you for your purchase.❤️",
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Error while verfying subscription.", 500)
    );
  }
};

// function to cancel subscription
const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    // Finding the user
    const user = await User.findById(id);

    // Checking the user role
    if (user.role === "admin") {
      return next(
        new AppError("Admin does not need to cannot cancel subscription", 400)
      );
    }

    // Finding subscription ID from subscription
    const subscriptionId = user.subscription.id;

    // Creating a subscription using Razorpay that we imported from the server
    try {
      const subscription = await razorpayInstance.subscriptions.cancel(
        subscriptionId // subscription id
      );

      // Adding the subscription status to the user account
      user.subscription.status = subscription.status;

      // Saving the user object
      await user.save();
    } catch (error) {
      // Returning error if any, and this error is from Razorpay so we have statusCode and message built in
      return next(new AppError(error.error.description, error.statusCode));
    }

    // Finding the payment using the subscription ID
    // const payment = await Payment.findOne({
    //   razorpay_subscription_id: subscriptionId,
    // });

    // // Getting the time from the date of successful payment (in milliseconds)
    // const timeSinceSubscribed = Date.now() - payment.createdAt;

    // // refund period which in our case is 15 days
    // const refundPeriod = 15 * 24 * 60 * 60 * 1000;

    // // Check if refund period has expired or not
    // if (refundPeriod <= timeSinceSubscribed) {
    //   return next(
    //     new AppError(
    //       "Refund period is over, so there will not be any refunds provided.",
    //       400
    //     )
    //   );
    // }

    // // If refund period is valid, then refund the full amount that the user has paid
    // console.log("Refunding payment with ID:", payment.razorpay_payment_id);
    // await razorpayInstance.payments.refund(payment.razorpay_payment_id, {
    //   speed: "optimum", // This is required
    // });

    // user.subscription.id = undefined; // Remove the subscription ID from the user DB
    // user.subscription.status = undefined; // Change the subscription Status in the user DB

    await user.save();
    // await payment.remove();

    // Send the response
    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully!",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// function get all subscription --(Admin)
const allSubscriptions = async (req, res, next) => {
  try {
    const { count, skip } = req.query;

    // Find all subscriptions from razorpay
    const allPayments = await razorpayInstance.subscriptions.all({
      count: count ? count : 10, // If count is sent then use that else default to 10
      skip: skip ? skip : 0, // // If skip is sent then use that else default to 0
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const finalMonths = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    const monthlyWisePayments = allPayments.items.map((payment) => {
      // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
      const monthsInNumbers = new Date(payment.start_at * 1000);

      return monthNames[monthsInNumbers.getMonth()];
    });

    monthlyWisePayments.map((month) => {
      Object.keys(finalMonths).forEach((objMonth) => {
        if (month === objMonth) {
          finalMonths[month] += 1;
        }
      });
    });

    const monthlySalesRecord = [];

    Object.keys(finalMonths).forEach((monthName) => {
      monthlySalesRecord.push(finalMonths[monthName]);
    });

    res.status(200).json({
      success: true,
      message: "All payments",
      allPayments,
      finalMonths,
      monthlySalesRecord,
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Error while fetching subscription.", 500)
    );
  }
};

export {
  getRazorpayKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  allSubscriptions,
};
