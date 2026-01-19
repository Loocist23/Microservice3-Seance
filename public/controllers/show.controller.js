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
            return res.status(404).json({message: 'Show dont exist'});
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
            price,
            id_movie,
            id_room
        } = req.body;

        if(!date || !price || !id_movie || !id_room) {
            return res.status(400).json({message: 'Attribute missing to create Show'});
        }

        const room = await Room.findByPk(id_room);

        if(!room) {
            return res.status(404).json({message: 'Room dont find'});
        }

        const newShow = await Show.create({
            date,
            price,
            id_movie,
            id_room
        });

        res.status(201).json(newShow);

    } catch(error) {
        res.status(500).json({message: 'Failure to create Show object', error: error.message});
    }
}

export const modifyShow = async (req,res) => {
    try {
        const show = await Show.findByPk(req.params.id);

        if(!show) {
            return res.status(404).json({message: 'Room dont exist'});
        }
        
        if (req.body.id_room) {
            const room = await Room.findByPk(req.body.id_room);
            if (!room) {
                return res.status(404).json({ message: 'Room dont find' });
            }
        }
        
        await show.update(req.body);

        res.status(200).json(show);
    } catch(error) {
        res.status(500).json({message: 'Failure to modify Show object', error: error.message});
    }
}

export const deleteShow = async (req, res) => {
    try {
        const show = await Show.findByPk(req.params.id);
        
        if (!show) {
            return res.status(404).json({ message: 'Show dont find' });
        }

        await show.destroy();

        res.status(200).json({ message: 'Sucess delete' });
    } catch (error) {
        res.status(500).json({ message: 'Failure to delete Show', error: error.message });
    }
};