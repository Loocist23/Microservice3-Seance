import ApiError from '../utils/ApiError.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const responsePayload = {
    message: err.message || 'Internal server error',
  };

  if (err.errors && err.errors.length > 0) {
    responsePayload.errors = err.errors;
  }

  if (process.env.NODE_ENV === 'development' && err.stack) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
