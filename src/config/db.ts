import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbUri = process.env.NODE_ENV === 'test'
      ? 'mongodb://localhost:27017/bookkeeping_test'
      : (process.env.MONGO_URI || "mongodb://localhost:27017/bookkeeping");

    await mongoose.connect(dbUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
};