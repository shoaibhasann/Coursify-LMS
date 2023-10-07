import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { razorpayInstance } from "../server.js";
import AppError from "../utils/error.util.js";
import crypto from "crypto";


// function to send razorpay api key
const getRazorpayKey = async (req, res, next) => {
    try{
        res.status(200).json({
          success: true,
          message: "Api Key send successfully!",
          key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error){
        return next(new AppError('Error while sending api key', 500));
    }
}

// function to buy subscription
const buySubscription = async (req, res, next) => {
    try{
        const { id } = req.user;
        
        const userExists = await User.findById(id);

        if(!userExists){
            return next(new AppError("Unauthorized, please login first.", 400));
        }

        if(userExists.role === 'admin'){
            return next(new AppError("Admin can't subscribe, Sorry!"));
        }

        // generating subscription ID
        const subscription = await razorpayInstance.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1,
            total_count: 1
        });

        userExists.subscription.id = subscription.id;
        userExists.subscription.status = subscription.status;

        await userExists.save();

        res.status(200).json({
            success: true,
            message: 'Enjoy, Subscribed successfully!',
            subscription_id: subscription.id
        })

    } catch (error){
        return next(new AppError(error.message || "Error while creating subscripton", 500))
    }
};

// function to verify payment of subscription
const verifySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

        const userExists = await User.findById(id);

        if(!userExists){
            return next(new AppError("Unauthorized, please login first.", 400));
        }

        const subscriptionID = userExists.subscription.id;

        const generateSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(`${razorpay_payment_id}|${subscriptionID}`).digest('hex');

        if(generateSignature !== razorpay_signature){
            return next(
                new AppError("Payment failed, please try again.", 400)
            )
        }

        // create payment record
        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        });

        // update subscription status of user
        userExists.subscription.status = 'active';
        await userExists.save();

        res.status(200).json({
            success: true,
            message: "Payment is successful!"
        });
    } catch (error) {
        return next(new AppError(error.message || "Error while verfying subscription.", 500));
    }
}

// function to cancel subscription
const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user;

        const userExists = await User.findById(id);

        if (!userExists) {
          return next(new AppError("Unauthorized, please login first.", 400));
        }

        if (userExists.role === "admin") {
          return next(new AppError("Admin can't unsubscribe, Sorry!"));
        }

        const subscriptionID = userExists.subscription.id;

        if(userExists.subscription.status === 'cancelled'){
            return next(
                new AppError("You already cancelled your subscription", 400)
            )
        }

        const cancel = await razorpayInstance.subscriptions.cancel(subscriptionID);

        userExists.subscription.status = cancel.status;

        await userExists.save();
    } catch (error) {
        return next(
            new AppError(error.message || "Error while cancelling subscription.", 500)
        )
    }
}

// function get all subscription --(Admin)
const allSubscriptions = async (req, res, next) => {
    try {

        const { count } = req.query;

        const payments = await razorpayInstance.subscriptions.all({
            count: count || 10
        });

        res.status(200).json({
            success: true,
            message: 'All subscription fetched successfully!',
            payments
        });
    } catch (error) {
        return next(
            new AppError(error.message || "Error while fetching subscription.", 500)
        )
    }
}

export {
    getRazorpayKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allSubscriptions
}