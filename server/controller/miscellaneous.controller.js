import Miscellaneous from "../models/miscellaneous.js";
import AppError from "../utils/error.util.js";


const createQuery = async(req, res, next) => {
    try {
        const { name , email, message } = req.body;

        const query = await Miscellaneous.create({
            name,
            email,
            message
        });

        if(!query){
            return next(new AppError("Failed in submitting your query", 400));
        }

        res.status(200).json({
            success: true,
            message: "Your query submitted successfully!"
        });
    } catch (error) {
        return next(
            new AppError(
                error.message , 500
            )
        )
    }
}

export { createQuery };