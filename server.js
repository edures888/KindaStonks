import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from './utils/connectDB.js'
import userRouter from './api/userRoutes.js'
import transactionRouter from './api/transactionRoutes.js'
import errorMiddleware from './middleware/errorMiddleware.js'
import { clientOrigin, serverPort } from './utils/env.dev.js'

// Connect to MongoDB
connectDB()

/* App configuration */
const app = express()
app.use(helmet())
app.use(cors({ origin: clientOrigin}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Router for Users API
app.use("/api/v1/users", userRouter)

//Router for Transaction API
app.use("/api/v1/transactions", transactionRouter)

// Current basic error middleware
app.use(errorMiddleware)

app.get("/", (req, res) => {
  res.json({message: "KindaStonksAPI"})
})  

// Listen to corresponding port once done
app.listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
