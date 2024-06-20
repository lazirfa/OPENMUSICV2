const routes = (handler) => [
    {
      method: 'GET',
      path: '/playlists/{id}/activities',
      handler: handler.postPlaylistSongActivitiesHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
    {
      method: 'GET',
      path: '/users',
      handler: handler.getUsersByUsernameHandler,
    },
  ];
  
  module.exports = routes;
  