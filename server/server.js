import { config } from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/db.js";
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';

// load enviroment varibles
config();

const port = process.env.PORT || 5000;

// cloudinary configuration 
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// razorpay configuration
export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
}); 

// start server
app.listen(port, async () => {
    await connectDatabase();
    console.log(`Server is running at http://localhost:${port} in ${process.env.NODE_ENV} mode.`)
});