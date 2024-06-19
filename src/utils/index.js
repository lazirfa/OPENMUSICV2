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

  const filterTitleSongByParam = (song, title) => (song.title.toLowerCase().includes(title));
  const filterPerformerSongByParam = (song, performer) => (song.performer.toLowerCase().includes(performer));
  
  module.exports = {
    mapAlbumsDB,
    mapSongDB,
    mapPlaylistsDB,
    mapPlaylistSongsDB,
    filterPerformerSongByParam,
    filterTitleSongByParam
  };
  