/**
 * Simple error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode ? res.statusCode : 500)
     .json(err.message)
} 

export default errorMiddleware