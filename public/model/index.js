import Show from './show.js';
import Room from './room.js';

Room.hasMany(Show, { foreignKey: 'id_room' });
Show.belongsTo(Room, { foreignKey: 'id_room'});

export { Show, Room };
