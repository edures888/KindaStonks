/**
 * Simple error handler middleware
 */
const errorMiddleware = (err, req, res, next) => { 
  res.status(err.status || 500).send(`${err.name}: ${err.message} `);
};

export default errorMiddleware;
