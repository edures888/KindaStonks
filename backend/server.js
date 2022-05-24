import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from 'url';
import connectDB from './connectDB.js'
import userRouter from './api/userRoutes.js'

// Load environment variables
dotenv.config() 
const port = process.env.PORT

// Connect to MongoDB
connectDB()

/* Setting up middlewares */
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/api/v1/users", userRouter)

// app get, send
app.get("/", (req, res) => {
  res.json({message: "Request to Server"})
})

// Start server, listen to corresponding port
app.listen(port, () => console.log(`Server running on port ${port}`));
