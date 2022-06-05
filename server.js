import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from './utils/connectDB.js'
import userRouter from './api/userRoutes.js'
import errorMiddleware from './middleware/errorMiddleware.js'

// Load environment variables
dotenv.config() 
const PORT = process.env.PORT

// Connect to MongoDB
connectDB()

/* Setting up middlewares */
const app = express()
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN_URL}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Router for Users API
app.use("/api/v1/users", userRouter)

// Current basic error middleware
app.use(errorMiddleware)

app.get("/", (req, res) => {
  res.json({message: "KindaStonksAPI"})
})  

// Listen to corresponding port once done
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
