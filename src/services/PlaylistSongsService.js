const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const { mapDBToModel } = require("../utils");
const NotFoundError = require("../exceptions/NotFoundError");

class PlaylistsongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistsong(songId, playlistId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
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
      text: `SELECT playlists.*, users.username FROM playlists inner join users on playlists.owner = users.id WHERE playlists.id = $1`,
      values: [id],
    };

    const querySong = {
        text: 'SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN playlist_songs ON playlist_songs.song_id=songs.id WHERE playlist_songs.playlist_id=$1',
        values: [id]
    };

    const fetchPlaylist = await this._pool.query(queryPlaylist);
    const fetchSong = await this._pool.query(querySong);

    if (!fetchPlaylist.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return {
        id: fetchPlaylist.rows[0].id,
        name: fetchPlaylist.rows[0].name,
        username: fetchPlaylist.rows[0].username,
        songs: fetchSong.rows
      };
}

  async deletePlaylistsong(songId, playlistId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id",
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal dihapus");
    }
  }

  async verifyCollaborator(songId, playlistId) {
    const query = {
      text: "SELECT * FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2",
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal diverifikasi");
    }
  }
}

module.exports = PlaylistsongsService;