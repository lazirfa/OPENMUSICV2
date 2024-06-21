const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const { mapDBToModel } = require("../utils");
const NotFoundError = require("../exceptions/NotFoundError");

class PlaylistsongactivitiesService {
  constructor() {
    this._pool = new Pool();
  }

    async getPlaylistsongactivityById(id) {
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
            playlistId: fetchPlaylist.rows[0].id,
            name: fetchPlaylist.rows[0].name,
            username: fetchPlaylist.rows[0].username,
            songs: fetchSong.rows
        };
    }
}

module.exports = PlaylistsongactivitiesService;