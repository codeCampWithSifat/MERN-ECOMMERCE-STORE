import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected mongodb");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
