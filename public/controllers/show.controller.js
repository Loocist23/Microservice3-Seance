import Show from '../model/show.js';
import Room from '../model/room.js';

export const getAllShow = async (req, res) => {
    try {
        const shows = await Show.findAll({
            include: [{
                model: Room,
                as: 'Room'
            }]
        });
        res.status(200).json(shows);
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

export const getShowById = async (req,res) => {
    try {
        const show = await Show.findByPk(req.params.id);
        if(!show) {
            res.status(404).json({message: 'Show dont exist', error: error.message});
        }

        res.status(200).json(show);
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

export const getShowByRoom = async (req,res) => {
    try {
        const shows = await Show.findAll({
            where: {id_room: req.params.id_room}
        });

        res.status(200).json(shows);
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

export const createShow = async (req,res) => {
    try {
        const {
            date,
            id_movie,
            id_room
        } = req.body;

        if(!date || !id_movie || !id_room) {
            res.status(400).json({message: 'Attribute missing to create Show', error: error.message});
        }

        const room = await Room.findByPk(id_room);

        if(!room) {
            res.status(404).json({message: 'Room dont find', error: error.message});
        }

        const newShow = await Show.create({
            date,
            id_movie,
            id_room
        });

        res.status(201).json(newShow);

    } catch(error) {
        res.status(500).json({message: 'Failure to create Show object', error: error.message});
    }
}