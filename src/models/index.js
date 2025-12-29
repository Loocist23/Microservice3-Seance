import Show from './show.js';
import Room from './room.js';

Room.hasMany(Show, {
  foreignKey: 'id_room',
  as: 'shows',
  onDelete: 'CASCADE',
  hooks: true,
});

Show.belongsTo(Room, {
  foreignKey: 'id_room',
  as: 'room',
});

export { Show, Room };
