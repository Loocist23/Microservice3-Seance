import Room from '../model/room.js';

export const getAllRoom = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.status(200).json(rooms);
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

export const createRoom = async (req, res) => {
    try {
        const {
            room_number, 
            seat_number, 
            room_type
        } = req.body;

        if(!room_number || !seat_number) {
            return res.status(400).json({message: 'Attribute missing to create Room', error: error.message});
        }

        const newRoom = await Room.create({
            room_number, 
            seat_number, 
            room_type
        });

        res.status(201).json(newRoom);
    } catch(error) {
        res.status(500).json({message: 'Failure to create Room object', error: error.message});
    }
}