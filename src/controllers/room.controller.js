import Room from '../models/room.js';
import AppError from '../utils/AppError.js';

export const getAllRoom = async (req, res, next) => {
    try {
        const rooms = await Room.findAll();
        res.status(200).json(rooms);
    } catch(error) {
        next(new AppError('Server error', 500));
    }
}

export const getRoomById = async (req, res, next) => {
    try {
        const room = await Room.findByPk(req.params.id);

        if(!room) {
            next(new AppError('Room dont exist', 404));
        }
        
        res.status(200).json(room);
    } catch(error) {
        next(new AppError('Server error', 500));
    }
}

export const createRoom = async (req, res, next) => {
    try {
        const {
            room_number, 
            seat_number, 
            room_type
        } = req.body;

        if(!room_number || !seat_number) {
            next(new AppError('Attribute missing to create Room', 400));
        }

        const newRoom = await Room.create({
            room_number, 
            seat_number, 
            room_type
        });

        res.status(201).json(newRoom);
    } catch(error) {
        next(new AppError('Failure to create Room', 500));
    }
}

export const modifyRoom = async (req, res, next) => {
    try {
        const room = await Room.findByPk(req.params.id);

        if(!room) {
            next(new AppError('Room dont exist', 404));
        }

        const allowedFields = ['room_number', 'seat_number', 'room_type'];
        for (let key of Object.keys(req.body)) {
            if (!allowedFields.includes(key)) {
                next(new AppError('Unexpected field', 400));
            }
        }

        await room.update(req.body);

        res.status(200).json(room);
    } catch(error) {
        next(new AppError('Failure to modify Room', 500));
    }
}

export const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findByPk(req.params.id);

        if(!room) {
            next(new AppError('Room dont exist', 404));
        }

        await room.destroy();

        res.status(200).json({message: 'Success delete'});
    } catch(error) {
        next(new AppError('Failure to delete Room', 500));
    }
}