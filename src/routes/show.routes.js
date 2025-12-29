import express from 'express';
import {
  createShow,
  deleteShow,
  getAllShow,
  getShowById,
  getShowByRoom,
  modifyShow,
} from '../controllers/show.controller.js';
import validateRequest from '../middleware/validateRequest.js';
import {
  createShowValidation,
  showIdParamValidation,
  showRoomParamValidation,
  updateShowValidation,
} from '../validators/show.validators.js';

const router = express.Router();

router.get('/', getAllShow);
router.get('/room/:id_room', showRoomParamValidation, validateRequest, getShowByRoom);
router.get('/:id', showIdParamValidation, validateRequest, getShowById);
router.post('/', createShowValidation, validateRequest, createShow);
router.put('/:id', showIdParamValidation, updateShowValidation, validateRequest, modifyShow);
router.delete('/:id', showIdParamValidation, validateRequest, deleteShow);

export default router;
