import express from 'express';
import {
  getAllRoom, 
  createRoom
} from '../public/controllers/room.controller.js';

const router = express.Router();

router.get('/', getAllRoom);
// router.get('/', getRoomById);
router.post('/', createRoom);
// router.put('/:id', modifyRoom);
// router.delete('/:id', deleteRoom);

export default router;