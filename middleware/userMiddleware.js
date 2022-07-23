/**
 * Middleware to decode JWT and add user ID to request
 * Decoding JWT here is safe since jwtCheck middleware
 * comes beforehand
 */
import jwtDecode from 'jwt-decode';
const userMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwtDecode(token);
  req.body.user_id = decodedToken.sub;
  next()
};

export default userMiddleware;
