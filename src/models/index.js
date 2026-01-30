import Show from './show.js';
import Room from './room.js';

Room.hasMany(Show, { foreignKey: 'id_room', as: 'shows' });
Show.belongsTo(Room, { foreignKey: 'id_room', as: 'Room' });

export { Show, Room };
