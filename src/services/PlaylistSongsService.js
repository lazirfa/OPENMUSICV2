const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const { mapPlaylistSongDB } = require("../utils");
const NotFoundError = require("../exceptions/NotFoundError");

class PlaylistSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistSong(playlistId, songId) {
        const id = `ps-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
          throw new InvariantError("Lagu gagal ditambahkan");
        }
    
        return result.rows[0].id;
    }

    async getPlaylistsongById(id) {
        const queryPlaylist = {
          text: `SELECT * FROM playlists WHERE id = $1`,
          values: [id],
        };

        const querySong = {
            text: 'SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN playlistsongs ON playlistsongs.song_id=songs.id WHERE playlistsongs.playlist_id=$1',
            values: [id]
        };

        const fetchPlaylist = await this._pool.query(queryPlaylist);
        const fetchSong = await this._pool.query(querySong);
    
        if (!result.rows.length) {
          throw new NotFoundError("Playlist tidak ditemukan");
        }
    
        return {
            id: fetchPlaylist.rows[0].id,
            name: fetchPlaylist.rows[0].name,
            year: fetchPlaylist.rows[0].owner,
            songs: fetchSong.rows
          };
    }

    async deletePlaylistsong(songId, playlistId) {
        const query = {
          text: "DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id",
          values: [songId, playlistId],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
          throw new InvariantError("Lagu gagal dihapus");
        }
      }

      async verifyCollaborator(songId, playlistId) {
        const query = {
          text: "SELECT * FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2",
          values: [songId, playlistId],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
          throw new InvariantError("Lagu gagal diverifikasi");
        }
      }
}

module.exports = PlaylistSongsService;