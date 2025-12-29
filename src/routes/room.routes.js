import express from 'express';
import {
  createRoom,
  deleteRoom,
  getAllRoom,
  getRoomById,
  modifyRoom,
} from '../controllers/room.controller.js';
import validateRequest from '../middleware/validateRequest.js';
import {
  createRoomValidation,
  roomIdParamValidation,
  updateRoomValidation,
} from '../validators/room.validators.js';

const router = express.Router();

router.get('/', getAllRoom);
router.get('/:id', roomIdParamValidation, validateRequest, getRoomById);
router.post('/', createRoomValidation, validateRequest, createRoom);
router.put('/:id', roomIdParamValidation, updateRoomValidation, validateRequest, modifyRoom);
router.delete('/:id', roomIdParamValidation, validateRequest, deleteRoom);

export default router;
