const InvariantError = require('../../exceptions/InvariantError');
const { PostPlaylistSongsPayloadSchema } = require('./schema');

const PlaylistSongsValidator = {
  validatePlaylistsongsPayload: (payload) => {
    const validationResult = PostPlaylistSongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
