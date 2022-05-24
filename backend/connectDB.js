import mongoose from "mongoose";

// Establish connection to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
      connectTimeoutMS: 5000,
      //useCreateIndex: true,
      //useFindAndModify: true,
    });
    console.log("MongoDB Connection Success");
  } catch (error) {
    console.log("MongoDB Connection Failed");
    console.error(error)
    process.exit(1);
  }
};

export default connectDB