class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async postPlaylistsHandler(request,h) {
        try {
          this._validator.validatePlaylistPayload(request.payload);
          const { name, owner } = request.payload;
          const playlistId = await this._service.addPalylist({ name, owner });
    
          const response = h.response({
            status: 'success',
            message: 'Palylist berhasil ditambahkan',
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
    
      async getPalylistsByIdHandler(request, h) {
        try {
          const {
            id,
          } = request.params;
          const playlist = await this._service.getPalylistById(id);
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

      async putPalylistsByIdHandler(request, h) {
        try {
          this._validator.validatePalylistPayload(request.payload);
          const {
            id,
          } = request.params;
    
          await this._service.editPalylistById(id, request.payload, );
    
          return {
            status: 'success',
            message: 'Palylist berhasil diperbarui',
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
      
      async deletePalylistsByIdHandler(request, h) {
        try {
          const {
            id,
          } = request.params;
          await this._service.deletePalylistById(id);
    
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
    