import { body, param } from 'express-validator';

export const showIdParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('Show id must be a positive integer'),
];

export const showRoomParamValidation = [
  param('id_room').isInt({ min: 1 }).withMessage('Room id must be a positive integer'),
];

export const createShowValidation = [
  body('date').isISO8601().withMessage('Date must be a valid ISO-8601 date'),
  body('id_movie').isInt({ min: 1 }).withMessage('Movie id must be a positive integer'),
  body('id_room').isInt({ min: 1 }).withMessage('Room id must be a positive integer'),
];

export const updateShowValidation = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO-8601 date'),
  body('id_movie')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Movie id must be a positive integer'),
  body('id_room')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Room id must be a positive integer'),
];
