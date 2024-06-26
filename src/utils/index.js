const mapAlbumsDB = ({
    id,
    name,
    year,
    songs,
  }) => ({
    id,
    name,
    year,
    songs,
  });

  const mapPlaylistSongsDB = ({
    id,
    name,
    username,
    songs,
  }) => ({
    id,
    name,
    username,
    songs,
  });

  const mapPlaylistsDB = ({
    id,
    name,
    username,
  }) => ({
    id,
    name,
    username,
  });
  
  const mapSongDB = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  });

  const mapDBToModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    inserted_at,
    updated_at,
    username,
    name,
    owner,
    playlist_id,
    song_id,
  }) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: inserted_at,
    updatedAt: updated_at,
    username,
    name,
    owner,
    playlistId: playlist_id,
    songId: song_id,
  });

  const filterTitleSongByParam = (song, title) => (song.title.toLowerCase().includes(title));
  const filterPerformerSongByParam = (song, performer) => (song.performer.toLowerCase().includes(performer));
  
  module.exports = {
    mapDBToModel,
    mapAlbumsDB,
    mapSongDB,
    mapPlaylistsDB,
    mapPlaylistSongsDB,
    filterPerformerSongByParam,
    filterTitleSongByParam
  };
  