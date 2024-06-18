const routes = (handler) => [
    {
      method: 'POST',
      path: '/playlists',
      handler: handler.postPlaylistsHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists',
      handler: handler.getPlaylistsHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists/{id}',
      handler: handler.getPalylistsByIdHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
    {
      method: 'PUT',
      path: '/playlists/{id}',
      handler: handler.putPalylistsByIdHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}',
      handler: handler.deletePalylistsByIdHandler,
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
  