import sequelize from '../connexion/database.js';
import { DataTypes } from 'sequelize';

const Room = sequelize.define('Room', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true, 
        autoIncrement: true
    },
    room_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    seat_number: DataTypes.INTEGER,
    room_type: DataTypes.STRING
}, {
    tableName: 'Room'
});

export default Room;