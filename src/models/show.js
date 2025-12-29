import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Show = sequelize.define(
  'Show',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_movie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'key from Movie microservice',
    },
    id_room: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Room',
        key: 'id',
      },
    },
  },
  {
    tableName: 'Show',
  }
);

export default Show;
