const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationError = require("../exceptions/AuthorizationError");
const { mapPlaylistSongsDB } = require("../utils");

class PlaylistsService {
    constructor(collaborationService) {
      this._pool = new Pool();
      this._collaborationService = collaborationService;
    }
  
    async addPlaylist(name, owner) {
      const id = `playlist-${nanoid(16)}`;
  
      const query = {
        text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
        values: [id, name, owner],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rows[0].id) {
        throw new InvariantError("Playlist gagal ditambahkan");
      }
  
      return result.rows[0].id;
    }
  
    async getPlaylists(owner) {
      const query = {
        text: `SELECT A.id, A.name, C.username AS username 
        FROM playlists A
        LEFT JOIN collaborations B ON B.playlist_id = A.id 
        LEFT JOIN users C ON C.id = A.owner 
        WHERE A.owner = $1 OR B.user_id = $1 
        GROUP BY (A.id, C.username)`,
        values: [owner],
      };
  
      const result = await this._pool.query(query);
      return result.rows.map(mapPlaylistSongsDB);
    }
  
    async getPlaylistById(id) {
      const query = {
        text: `SELECT playlists.*, users.username
        FROM playlists
        LEFT JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1`,
        values: [id],
      };
      const result = await this._pool.query(query);
  
      if (!result.rows.length) {
        throw new NotFoundError("Playlist tidak ditemukan");
      }
  
      return result.rows.map(mapPlaylistSongsDB)[0];
    }
  
    async editPlaylistById(id, {
      name,
    }) {
      const updatedAt = new Date().toISOString();
      const query = {
        text: "UPDATE playlists SET name = $1 WHERE id = $2 RETURNING id",
        values: [name, id],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rows.length) {
        throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
      }
    }
  
    async deletePlaylistById(id) {
      const query = {
        text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
        values: [id],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rows.length) {
        throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
      }
    }
  
    async verifyPlaylistOwner(id, owner) {
      const query = {
        text: "SELECT * FROM playlists WHERE id = $1",
        values: [id],
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError("Playlist tidak ditemukan");
      }
      const playlist = result.rows[0];
      if (playlist.owner !== owner) {
        throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
      }
    }
  
    async verifyPlaylistAccess(playlistId, userId) {
      try {
        await this.verifyPlaylistOwner(playlistId, userId);
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        
        try {
          await this._collaborationService.verifyCollaborator(playlistId, userId);
        } catch {
          throw error;
        }
      }
    }
  }
  
  module.exports = PlaylistsService;
  