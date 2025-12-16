import express from 'express';
import {
    getAllShow,
    getShowById,
    getShowByRoom,
    createShow
} from '../public/controllers/show.controller.js';

const router = express.Router();

router.get('/', getAllShow);
router.get('/:id', getShowById);
router.get('/room/:id_room', getShowByRoom);
router.post('/', createShow);
// router.put('/:id', modifyShow);
// router.delete('/:id', deleteShow);

export default router;