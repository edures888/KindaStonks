import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from 'url';
import connectDB from './utils/connectDB.js'
import userRouter from './api/userRoutes.js'

// Load environment variables
dotenv.config() 
const PORT = process.env.PORT

// Connect to MongoDB
connectDB()

/* Setting up middlewares */
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Router for Users API
app.use("/api/v1/users", userRouter)

// Current basic error middleware
app.use((err, req, res, next) => {
  res.status(res.statusCode ? res.statusCode : 500)
     .json(err.message)
})

// Homepage for now
app.get("/", (req, res) => {
  res.json({message: "KindaStonksAPI"})
})

// For deployment/production
if (process.env.NODE_ENV === "production") {
	// Make node server serve static built files
  app.use(express.static('client/build'));

	app.get('*', (req, res) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
		res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    //app.use(express.static(__dirname + '/public'));
	});
}

// Listen to corresponding port once done
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
