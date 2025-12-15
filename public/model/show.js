import sequelize from '../connexion/database.js';
import { DataTypes } from 'sequelize';

const Show = sequelize.define('Show', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true, 
        autoIncrement: true
    }, 
    date: DataTypes.DATE,
    id_movie: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        comment: 'key from Movie in microservice2'
    },
    id_room: {
        type: DataTypes.INTEGER,
        references: {
            model:'Room',
            key: 'id'
        }
    }
}, {
    tableName: 'Show'
});

export default Show;