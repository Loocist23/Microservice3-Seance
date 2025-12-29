import { body, param } from 'express-validator';

export const roomIdParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('Room id must be a positive integer'),
];

export const createRoomValidation = [
  body('room_number')
    .isInt({ min: 1 })
    .withMessage('Room number must be a positive integer'),
  body('seat_number')
    .isInt({ min: 1 })
    .withMessage('Seat number must be a positive integer'),
  body('room_type').optional().isString().withMessage('Room type must be a string'),
];

export const updateRoomValidation = [
  body('room_number')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Room number must be a positive integer'),
  body('seat_number')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Seat number must be a positive integer'),
  body('room_type').optional().isString().withMessage('Room type must be a string'),
];
