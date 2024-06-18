require('dotenv').config();
const Hapi = require('@hapi/hapi');

const album = require('./api/albums');
const AlbumsService = require('./services/AlbumService');
const AlbumsValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/SongsService');
const SongsValidator = require('./validator/songs');


const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  await server.register([{
    plugin: songs,
    options: {
      service: new SongsService(),
      validator: SongsValidator,
    },
  },
  {
    plugin: album,
    options: {
      service: new AlbumsService(),
      validator: AlbumsValidator,
    },
  },
]);
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();