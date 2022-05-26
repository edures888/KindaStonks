import bcrypt from "bcryptjs/dist/bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export default class UserController {
  // Create new user to add to database
  static async registerUser(req, res) {
    try {
      /* Using Model validators to ensure no duplicate user with same usename/email AND that all necessary fields are filled 
      
      if (!username || !password || !email) {
      res.status(400).send("Missing fields for registering new user");
      return;
      */

      // Hashing password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User(...req.body, hashedPassword);
      await newUser.save();
      res.status(200).send("User registered");
    } catch (error) {
      res.status(500).send("Error creating new user" + error.messages);
      next(error);
    }
  }

  // Authenticate user login information
  static async loginUser(req, res) {
    const { username, password } = req.body;

    try {
      // Use exec() for better stack traces
      const user = await User.findOne({ username }).exec();
      if (!user) {
        res.status(400).send("Invalid login credentials");
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        res.status(200).json({
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).send("Invalid login credentials");
      }
    } catch (error) {
      res.status(500).send("Error finding user" + error.messages);
      next(error);
    }
  }

  // Generate Json Web Token
  static async generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_PRIVATE, {
      expiresIn: "7d",
    });
  }

  // Retrieve user details
  static async getUser(req, res) {
    try{
      const user = await User.findById(req.user.id).exec()
      res.status(200).json({
        id: _id,
        username,
        email,
        name,
      })
    } catch(error) {
        res.status(500).send("Error retriving user details" + error.messages);
        next(error);
      };
  }
}
