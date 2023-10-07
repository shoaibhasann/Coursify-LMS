import AppError from "../utils/error.util.js";
import JWT from "jsonwebtoken";

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
    const currentRole = req.user.role;

    if (!roles.includes(currentRole)) {
      return next(
        new AppError("You don't have permission to acess this route.", 403)
      );
    }

    next();
  };

// middleware to check subscription active or not
const authorizedSubscriber = async (req, res, next) => {
  const subscriptionStatus = req.user.subscription;

  const currentRole = req.user.role;

  if (currentRole !== "admin" && subscriptionStatus !== "active") {
    return next(
      new AppError("Please subscribed first to access all features.", 403)
    );
  }

  next();
};

export { isLoggedIn, authorizedRoles, authorizedSubscriber };
