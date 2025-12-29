import Show from '../models/show.js';
import Room from '../models/room.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllShow = asyncHandler(async (req, res) => {
  const shows = await Show.findAll({
    include: [
      {
        model: Room,
        as: 'room',
        attributes: ['id', 'room_number', 'room_type', 'seat_number'],
      },
    ],
    order: [['date', 'ASC']],
  });
  res.status(200).json(shows);
});

export const getShowById = asyncHandler(async (req, res) => {
  const show = await Show.findByPk(req.params.id, {
    include: [
      {
        model: Room,
        as: 'room',
        attributes: ['id', 'room_number', 'room_type', 'seat_number'],
      },
    ],
  });

  if (!show) {
    throw new ApiError(404, 'Show not found');
  }

  res.status(200).json(show);
});

export const getShowByRoom = asyncHandler(async (req, res) => {
  const { id_room } = req.params;

  const room = await Room.findByPk(id_room);
  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  const shows = await Show.findAll({
    where: { id_room },
    order: [['date', 'ASC']],
  });

  res.status(200).json(shows);
});

export const createShow = asyncHandler(async (req, res) => {
  const { date, id_movie, id_room } = req.body;

  const room = await Room.findByPk(id_room);
  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  const newShow = await Show.create({
    date,
    id_movie,
    id_room,
  });

  res.status(201).json(newShow);
});

export const modifyShow = asyncHandler(async (req, res) => {
  const show = await Show.findByPk(req.params.id);

  if (!show) {
    throw new ApiError(404, 'Show not found');
  }

  if (req.body.id_room && req.body.id_room !== show.id_room) {
    const room = await Room.findByPk(req.body.id_room);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }
  }

  await show.update(req.body);

  res.status(200).json(show);
});

export const deleteShow = asyncHandler(async (req, res) => {
  const show = await Show.findByPk(req.params.id);

  if (!show) {
    throw new ApiError(404, 'Show not found');
  }

  await show.destroy();

  res.status(200).json({ message: 'Show deleted successfully' });
});
