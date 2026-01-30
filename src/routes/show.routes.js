import express from 'express';
import {
    getAllShow,
    getShowById,
    getShowByRoom,
    createShow, 
    modifyShow, 
    patchShow,
    reserveShowSeats,
    deleteShow
} from '../controllers/show.controller.js';

const router = express.Router();

router.get('/', getAllShow);
router.get('/room/:id_room', getShowByRoom);
router.get('/:id', getShowById);
router.post('/', createShow);
router.post('/:id/reserve', reserveShowSeats);
router.put('/:id', modifyShow);
router.patch('/:id', patchShow);
router.delete('/:id', deleteShow);

export default router;
