import AppError from "../utils/error.util.js";
import JWT from "jsonwebtoken";
import User from "../models/user.model.js";

// middleware to check user loggedin or not
const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError("Unauthenticated, please login again", 401));
  }

  const userDetails = await JWT.verify(token, process.env.JWT_SECRET);

  req.user = userDetails;

  next();
};

// middleware to check authorized role
const authorizedRoles =
  (...roles) =>
  async (req, res, next) => {
    const { id } = req.user;
    const accessUser = await User.findById(id);

    if (!roles.includes(accessUser.role)) {
      return next(
        new AppError("You don't have permission to acess this route.", 403)
      );
    }

    next();
  };

// middleware to check subscription active or not
const authorizedSubscriber = async (req, res, next) => {

  // extract id from request user
  const { id } = req.user

  // searching user in db
  const accessUser = await User.findById(id);
  const subscriptionStatus = accessUser.subscription.status;

  const currentRole = accessUser.role;

  if (currentRole !== "admin" && subscriptionStatus !== "active") {
    return next(
      new AppError("Please subscribed first to access all features.", 403)
    );
  }

  next();
};

export { isLoggedIn, authorizedRoles, authorizedSubscriber };
