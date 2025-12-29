import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Room = sequelize.define(
  'Room',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    room_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    seat_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    room_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'Room',
  }
);

export default Room;
