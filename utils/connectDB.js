import mongoose from "mongoose";
import { databaseURI } from "./env.dev.js";

/**
 * Establish connection to MongoDB
 */
const connectDB = async () => {
  mongoose.connect(databaseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connection Success"))
    .catch(error => {
      console.log("MongoDB Connection Failed");
      console.error(error)
      process.exit();
    })
};

export default connectDB