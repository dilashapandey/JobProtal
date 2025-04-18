import mongoose from "mongoose";

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected!! ");
    } catch (error) {
        console.log(error);
    }
}

export default ConnectDB;