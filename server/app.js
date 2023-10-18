import { config } from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import userRoutes from "./route/user.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import courseRoutes from "./route/course.route.js";
import paymentRoutes from "./route/payment.route.js";
import miscellaneousRoutes from "./route/miscellaneous.route.js";

// load enviroment variables
config();

// create an instance of express
const app = express();

// middleware to parse request body
app.use(express.json());

// parsing encoded url
app.use(
  express.urlencoded({
    extended: true,
  })
);

// middleware to pare cookie
app.use(cookieParser());

// enable cors
app.use(
  cors({
    origin: ["*"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

// handle user routes
app.use("/api/v1/auth", userRoutes);

// handle course routes
app.use("/api/v1/courses", courseRoutes);

// handle payment routes
app.use("/api/v1/payments", paymentRoutes);

// handle miscellaneous routes
app.use("/api/v1", miscellaneousRoutes);

// handle wildcard routes
app.use("*", (req, res) => {
  res.send("OOPS! 404 Page Not Found");
});

// middleware for error handling
app.use(errorMiddleware);

export default app;
