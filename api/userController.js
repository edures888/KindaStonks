import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export default class UserController {
  // Create new user to add to database
  static async registerUser(req, res, next) {
    const { username, email, password, name } = req.body
    try {
      /* Should use Model validators to ensure no duplicate user with same usename/email AND that all necessary fields are filled */
      if (!username || !password || !email) {
        res.status(400).send("Missing fields for registering new user");
        return;
      }  

      // Hashing password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        name
      });
      await newUser.save();
      res.status(200).send("User registered");
    } catch (error) {
      res.status(500).send("Error creating new user: " + error.message);
      next(error);
    }
  }

  // Authenticate user login information
  static async loginUser(req, res, next) {
    const { username, password } = req.body;

    try {
      // Use exec() for better stack traces
      const user = await User.findOne({ username }).exec();
      if (!user || !username || !password) {
        res.status(400).send("Invalid login credentials");
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = generateToken(user._id)
        res.status(200).json({
          email: user.email,
          token,
        });
      } else {
        res.status(400).send("Invalid login credentials");
      }
    } catch (error) {
      res.status(500).send("Error finding user: " + error.message);
      next(error);
    } 
  }


  // Retrieve user details
  static async getUser(req, res, next) {
    try{
      const { _id, username, email, name } = await User.findById(req.user.id).exec()
      res.status(200).json({
        _id,
        username,
        email,
        name,
      })
    } catch(error) {
        res.status(500).send("Error retriving user details" + error.message);
        next(error);
      };
  }

  static async protectedInfo(req, res, next) {
    try {
      res.status(200).json(message: "This is protected info")
    } catch (error) {
      res.statuss(500).send("Error retriving user details" + error.message);
    }
  }
}

 // Generate Json Web Token
 function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_PRIVATE, {
    expiresIn: "7d",
  });
} 


