import Show from '../models/show.js';
import Room from '../models/room.js';
import AppError from '../utils/AppError.js';

export const getAllShow = async (req, res, next) => {
    try {
        const shows = await Show.findAll({
            include: [{
                model: Room,
                as: 'Room'
            }]
        });
        res.status(200).json(shows);
    } catch(error) {
        next(new AppError('Server error', 500));
    }
}

export const getShowById = async (req, res, next) => {
    try {
        const show = await Show.findByPk(req.params.id);
        if(!show) {
            next(new AppError('Show dont exist', 404));
        }

        res.status(200).json(show);
    } catch(error) {
        next(new AppError('Server error', 500));
    }
}

export const getShowByRoom = async (req, res, next) => {
    try {
        const shows = await Show.findAll({
            where: {id_room: req.params.id_room}
        });

        res.status(200).json(shows);
    } catch(error) {
        next(new AppError('Server error', 500));
    }
}

export const createShow = async (req, res, next) => {
    try {
        const {
            date,
            price,
            id_movie,
            id_room
        } = req.body;
        
        if(!date || !price || !id_movie || !id_room) {
            return res.status(400).json({message: 'Attribute missing to create Show'});
        }

        const room = await Room.findByPk(id_room);

        if(!room) {
            next(new AppError('Room dont exist', 404));
        }

        const newShow = await Show.create({
            date,
            price,
            id_movie,
            id_room
        });

        res.status(201).json(newShow);

    } catch(error) {
        next(new AppError('Failure to create Show object', 500));
    }
}

export const modifyShow = async (req, res, next) => {
    try {
        const show = await Show.findByPk(req.params.id);

        if(!show) {
            next(new AppError('Show dont exist', 404));
        }
        
        if (req.body.id_room) {
            const room = await Room.findByPk(req.body.id_room);
            if (!room) {
                next(new AppError('Room dont find', 404));
            }
        }
        
        await show.update(req.body);

        res.status(200).json(show);
    } catch(error) {
        next(new AppError('Failure to modify Show object', 500));
    }
}

export const deleteShow = async (req, res, next) => {
    try {
        const show = await Show.findByPk(req.params.id);
        
        if (!show) {
            next(new AppError('Show dont find', 404));
        }

        await show.destroy();

        res.status(200).json({ message: 'Sucess delete' });
    } catch (error) {
        next(new AppError('Failure to delete Show', 500));
    }
};