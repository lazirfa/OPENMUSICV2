const PlaylistSongActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'palylist_song_activities',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistsongactivitiesHandler = new PlaylistSongActivitiesHandler(service, validator);
    server.route(routes(playlistsongactivitiesHandler));
  },
};
