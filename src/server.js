require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// album
const album = require('./api/albums');
const AlbumsService = require('./services/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/UsersService');
const UsersValidator = require('./validator/users');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlistsongs
const playlistsongs = require("./api/playlistsongs");
const PlaylistsongsService = require("./services/PlaylistsongsService");
const PlaylistsongsValidator = require("./validator/playlistsongs");

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const ClientError = require('./exceptions/ClientError');


const init = async () => {
  const albumService = new AlbumsService();
  const collaborationsService = new CollaborationsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const songsService = new SongsService();
  const playlistsService = new PlaylistsService();
  const playlistsongsService = new PlaylistsongsService(collaborationsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);
 
  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([{
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  },
  {
    plugin: album,
    options: {
      service: albumService,
      validator: AlbumsValidator,
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  },
  {
    plugin: playlists,
    options: {
      service: playlistsService,
      validator: PlaylistsValidator,
    },
  },
  {
    plugin: collaborations,
    options: {
      collaborationsService,
      playlistsService,
      validator: CollaborationsValidator,
    },
  },
  {
    plugin: playlistsongs,
    options: {
      playlistsongsService,
      playlistsService,
      validator: PlaylistsongsValidator,
    },
  },
]);

// server.ext('onPreResponse', (request, h) => {
//   // mendapatkan konteks response dari request
//   const { response } = request;

//   if (response instanceof Error) {
//     // penanganan client error secara internal.
//     if (response instanceof ClientError) {
//       const newResponse = h.response({
//         status: 'fail',
//         message: response.message,
//       });
//       newResponse.code(response.statusCode);
//       return newResponse;
//     }

//     // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
//     if (!response.isServer) {
//       return h.continue;
//     }

//     // penanganan server error sesuai kebutuhan
//     const newResponse = h.response({
//       status: 'error',
//       message: 'terjadi kegagalan pada server kami',
//     });
//     newResponse.code(500);
//     return newResponse;
//   }

//     // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
//     return h.continue;
//   });
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();