import jwt from "jsonwebtoken";
import User from "../models/user.model";


const protectRoute = (req, res, next) => {
  let token

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Getting token from header
      token = authHeader.split(' ')[1]

      const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE)
      
      // Get user from token and assign to Request object, excluding password
      req.user = await User.findById(decodedToken.id).select('-password')
      
      next()
    } catch(error) {
      res.status(401)
      next(new Error('Not authorized to access this route'))
      return
    }

    if (!token) {
      res.status(401)
      next(new Error('Not authorized, no token'))
      return
    }
  }
}

export default protectRoute
