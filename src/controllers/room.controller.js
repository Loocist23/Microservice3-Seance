import Room from '../models/room.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllRoom = asyncHandler(async (req, res) => {
  const rooms = await Room.findAll();
  res.status(200).json(rooms);
});

export const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findByPk(req.params.id);

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  res.status(200).json(room);
});

export const createRoom = asyncHandler(async (req, res) => {
  const { room_number, seat_number, room_type } = req.body;

  const existingRoom = await Room.findOne({ where: { room_number } });
  if (existingRoom) {
    throw new ApiError(409, 'Room number already exists');
  }

  const newRoom = await Room.create({
    room_number,
    seat_number,
    room_type,
  });

  res.status(201).json(newRoom);
});

export const modifyRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByPk(req.params.id);

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  if (req.body.room_number && req.body.room_number !== room.room_number) {
    const conflictingRoom = await Room.findOne({ where: { room_number: req.body.room_number } });
    if (conflictingRoom) {
      throw new ApiError(409, 'Room number already exists');
    }
  }

  await room.update(req.body);

  res.status(200).json(room);
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByPk(req.params.id);

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  await room.destroy();

  res.status(200).json({ message: 'Room deleted successfully' });
});
