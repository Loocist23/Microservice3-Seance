import express from 'express';
import {
    getAllShow
} from '../public/controllers/show.controller.js';

const router = express.Router();

router.get('/', getAllShow);
// router.get('/', getShowById);
// router.get('/room/:id_room', getShowByRoom);
// router.post('/', createShow);
// router.put('/:id', modifyShow);
// router.delete('/:id', deleteShow);

export default router;