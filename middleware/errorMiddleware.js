/**
 * Simple error handler middleware
 */
const errorMiddleware = (err, req, res, next) => {
  console.log(err)
} 

export default errorMiddleware