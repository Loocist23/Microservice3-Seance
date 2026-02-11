import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Request validation failed', errors.array()));
  }

  return next();
};

export default validateRequest;
