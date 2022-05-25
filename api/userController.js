import bcrypt from "bcryptjs/dist/bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export default class UserController {
  // Create new user to add to database
  static async registerUser(req, res) {
    const { username, password, email, name } = req.body;
    // Validate user
    if (!username || !password || !email) {
      res.status(400);
      next(new Error("Missing fields for registering new user"));
      return;
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User(...req.body, hashedPassword);
    // Using Model validators to ensure no duplicate user with same usename/email
    newUser
      .save()
      .then(() => res.status(200).send("User registered"))
      .catch((err) => {
        res.status(500).send("Error creating new user" + err.messages);
        next(err);
      });
  }

  // Authenticate user login information
  static async loginUser(req, res) {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(400);
      next(new Error("Invalid login credentials"));
      return;
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      // RESPOND
      res.status(200).json({
        username: user.username,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      next(new Error("Invalid login credentials"));
      return;
    }
  }

  // Generate Json Web Token
  static async generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_PRIVATE, {
      expiresIn: '7d'
    })
  }

  // Retrieve user details
  static async getUser(req, res) {
    User.findById(req.user.id)
        .then(() => res.status(200).json({
            id: _id,
            username,
            email,
            name
          }))
        .catch(err => {
          res.status(500).send("Error retriving user details" + err.messages)
          next(err);
        })
  }
}
