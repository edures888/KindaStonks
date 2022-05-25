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

app.use("/api/v1/users", userRouter)

// app get, send
app.get("/", (req, res) => {
  res.json({message: "KindaStonksAPI"})
})

if (process.env.NODE_ENV === "production") {
	// Make node server serve static built files
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static('client/build'));

  //
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    //app.use(express.static(__dirname + '/public'));
	});
}

// Start server, listen to corresponding port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
