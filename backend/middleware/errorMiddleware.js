export const errorHandler = (err, req, res, next) => {
  console.error("DEBUG ERROR:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
