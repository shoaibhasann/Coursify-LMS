import mongoose from "mongoose"

// function to connect server from database
const connectDatabase = async () => {
    mongoose.set('strictQuery', true);
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected successfully to MongoDB: ${connection.host}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDatabase;