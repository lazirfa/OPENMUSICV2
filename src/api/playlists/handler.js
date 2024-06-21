const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.postPlaylistsHandler = this.postPlaylistsHandler.bind(this);
        this.getPlaylistsByIdHandler = this.getPlaylistsByIdHandler.bind(this);
        this.putPlaylistsByIdHandler = this.putPlaylistsByIdHandler.bind(this);
        this.deletePlaylistsByIdHandler = this.deletePlaylistsByIdHandler.bind(this);
    }

    async getPlaylistsHandler(request, h) {
      try {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId);

        const playlistsProps = playlists.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          username: playlist.username,
        }));

        return {
          status: 'success',
          data: {
            playlistsProps,
          },
        };
      } catch (error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          }, );
          response.code(error.statusCode, );
          return response;
        }
  
        // Server ERROR!
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
  
        response.code(500);
        console.error(error);
        return response;
      }
    }

    async postPlaylistsHandler(request,h) {
        try {
          this._validator.validatePlaylistsPayload(request.payload);
          const { name } = request.payload;

          const { id } = request.auth.credentials;
          const playlistId = await this._service.addPlaylist( name, id );
    
          const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
          });
    
          response.code(201);
          return response;
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            }, );
            response.code(error.statusCode, );
            return response;
          }
    
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          
          response.code(500);
          console.error(error);
    
          return this._service;
        }
      }
    
      async getPlaylistsByIdHandler(request, h) {
        try {
          const { id } = request.params;
          const { id: credentialId } = request.auth.credentials;
    
          await this._service.verifyPlaylistAccess(id, credentialId);
          const playlist = await this._service.getPlaylistById(id);

          return {
            status: 'success',
            data: {
              playlist,
            },
          };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            }, );
            response.code(error.statusCode, );
            return response;
          }
    
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
    
          response.code(500);
          console.error(error);
          return response;
        }
      }

      async putPlaylistsByIdHandler(request, h) {
        try {

          this._validator.validatePlaylistsPayload(request.payload);
          const { id } = request.params;
          const { id: credentialId } = request.auth.credentials;
    
          await this._service.verifyPlaylistAccess(id, credentialId);
          await this._service.editPlaylistById(id, request.payload);
    
          return {
            status: 'success',
            message: 'Playlist berhasil diperbarui',
          };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            }, );
            response.code(error.statusCode, );
            return response;
          }
    
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
    
          response.code(500);
          console.error(error);
          return response;
        }
    
      }
      
      async deletePlaylistsByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyPlaylistOwner(id, credentialId);
            await this._service.deletePlaylistById(id);
    
            return {
              status: 'success',
              message: 'Lagu berhasil dihapus',
            };
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            }, );
            response.code(error.statusCode);
            return response;
          }
    
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          
          response.code(500);
          console.error(error);
          return response;
        }
      }
    }
    
module.exports = PlaylistsHandler;
    