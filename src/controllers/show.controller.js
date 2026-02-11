import sequelize from '../config/database.js';
import Show from '../models/show.js';
import Room from '../models/room.js';
import AppError from '../utils/AppError.js';

const includeRoom = [{ model: Room, as: 'Room' }];

const handleError = (error, next, fallbackMessage) => {
    if (error instanceof AppError) {
        return next(error);
    }
    console.error(error);
    return next(new AppError(fallbackMessage, 500));
};

const findShowOrThrow = async (id, options = {}) => {
    const show = await Show.findByPk(id, options);
    if (!show) {
        throw new AppError('Show dont exist', 404);
    }
    return show;
};

const ensureRoomExists = async (roomId) => {
    if (!roomId) {
        throw new AppError('Room id required', 400);
    }
    const room = await Room.findByPk(roomId);
    if (!room) {
        throw new AppError('Room dont exist', 404);
    }
    return room;
};

const extractSeatsCount = (payload = {}) => {
    const candidate = payload.seats ?? payload.places ?? payload.quantity ?? payload.count;
    const seats = Number(candidate);
    if (!Number.isInteger(seats)) {
        return null;
    }
    return seats;
};

const applyShowUpdate = async (req, res, next, { requireBody = false } = {}) => {
    try {
        const payload = req.body ?? {};
        if (requireBody && Object.keys(payload).length === 0) {
            throw new AppError('Aucune donnée fournie pour la mise à jour.', 400);
        }

        const show = await findShowOrThrow(req.params.id);

        if (payload.id_room) {
            await ensureRoomExists(payload.id_room);
        }

        await show.update(payload);
        res.status(200).json(show);
    } catch (error) {
        handleError(error, next, 'Failure to modify Show object');
    }
};

export const getAllShow = async (req, res, next) => {
    try {
        const shows = await Show.findAll({ include: includeRoom });
        res.status(200).json(shows);
    } catch (error) {
        handleError(error, next, 'Server error');
    }
};

export const getShowById = async (req, res, next) => {
    try {
        const show = await findShowOrThrow(req.params.id, { include: includeRoom });
        res.status(200).json(show);
    } catch (error) {
        handleError(error, next, 'Server error');
    }
};

export const getShowByRoom = async (req, res, next) => {
    try {
        const shows = await Show.findAll({
            where: { id_room: req.params.id_room },
            include: includeRoom
        });
        res.status(200).json(shows);
    } catch (error) {
        handleError(error, next, 'Server error');
    }
};

export const createShow = async (req, res, next) => {
    try {
        const {
            date,
            price,
            id_movie,
            id_room
        } = req.body;

        if (date === undefined || price === undefined || id_movie === undefined || id_room === undefined) {
            throw new AppError('Attribute missing to create Show', 400);
        }

        await ensureRoomExists(id_room);

        const newShow = await Show.create({
            date,
            price,
            id_movie,
            id_room
        });

        await newShow.reload({ include: includeRoom });

        res.status(201).json(newShow);
    } catch (error) {
        handleError(error, next, 'Failure to create Show object');
    }
};

export const modifyShow = (req, res, next) => applyShowUpdate(req, res, next);

export const patchShow = (req, res, next) =>
    applyShowUpdate(req, res, next, { requireBody: true });

export const reserveShowSeats = async (req, res, next) => {
    let transaction;
    try {
        const requestedSeats = extractSeatsCount(req.body);
        if (!requestedSeats || requestedSeats <= 0) {
            throw new AppError('Le nombre de places doit être un entier positif.', 400);
        }

        transaction = await sequelize.transaction();
        const show = await findShowOrThrow(req.params.id, {
            include: includeRoom,
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        const room = show.Room ?? await Room.findByPk(show.id_room, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!room) {
            throw new AppError('Room dont exist', 404);
        }

        const capacity = Number(room.seat_number ?? 0);
        if (capacity <= 0) {
            throw new AppError('Capacité de salle introuvable pour cette séance.', 422);
        }

        if (show.seats_taken + requestedSeats > capacity) {
            throw new AppError('Nombre de places demandé indisponible pour cette séance.', 409);
        }

        show.seats_taken += requestedSeats;
        await show.save({ transaction });

        await transaction.commit();
        await show.reload({ include: includeRoom });

        res.status(200).json(show);
    } catch (error) {
        if (transaction && transaction.finished !== 'commit') {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.error('Rollback error:', rollbackError);
            }
        }
        handleError(error, next, 'Failure to reserve seats');
    }
};

export const deleteShow = async (req, res, next) => {
    try {
        const show = await findShowOrThrow(req.params.id);
        await show.destroy();
        res.status(200).json({ message: 'Sucess delete' });
    } catch (error) {
        handleError(error, next, 'Failure to delete Show');
    }
};
