import mongoose from "mongoose";

// Establish connection to MongoDB
const connectDB = async () => {
  mongoose.connect(process.env.DB_URI, {
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