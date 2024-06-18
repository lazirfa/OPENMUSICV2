class PlaylistSongActivitiesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async postPlaylistSongActivitiesHandler(request,h) {
        try {
          this._validator.validatePlaylistSongActivitiesPayload(request.payload);
          const { playlistId, activities  } = request.payload;
          const playlistSongActivities = await this._service.addPlaylistSongActivities({ playlistId, activities });
    
          const response = h.response({
            status: 'success',
            message: 'Palylist song activities berhasil ditambahkan',
            data: {
                playlistSongActivities,
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
    
      async getPlaylistSongActivitiesByIdHandler(request, h) {
        try {
          const {
            id,
          } = request.params;
          const playlistsongactivities = await this._service.getPlaylistSongActivitiesById(id);
          return {
            status: 'success',
            data: {
                playlistsongactivities,
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

      async putPlaylistSongActivitiesByIdHandler(request, h) {
        try {
          this._validator.validatePlaylistSongActivitiesPayload(request.payload);
          const {
            id,
          } = request.params;
    
          await this._service.editPlaylistSongActivitiesById(id, request.payload, );
    
          return {
            status: 'success',
            message: 'Palylist song activities berhasil diperbarui',
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
      
      async deletePlaylistSongActivitiesByIdHandler(request, h) {
        try {
          const {
            id,
          } = request.params;
          await this._service.deletePlaylistSongActivitiesById(id);
    
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