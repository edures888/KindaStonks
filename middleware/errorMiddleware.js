/**
 * Simple error handler middleware
 */
const errorMiddleware = (err, req, res, next) => {
  res
    .status(err.status || 500)
    .send(`Error Middleware, ${err.name}: ${err.message} `);
};

export default errorMiddleware;
