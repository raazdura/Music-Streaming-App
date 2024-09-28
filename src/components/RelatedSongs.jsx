import React from 'react';
import SongBar from './SongBar';
import PlayAll from '../components/PlayAll';
import { useDispatch } from 'react-redux';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const RelatedSongs = ({ data, artistId, isPlaying, activeSong }) => {
  const dispatch = useDispatch();

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };
  
  return (
    <div className="flex flex-col">
      <PlayAll 
        type="artist" 
        data={data} 
        artistId={artistId} 
        isPlaying={isPlaying} 
        activeSong={activeSong} 
        handlePauseClick={handlePauseClick} 
        handlePlayClick={handlePlayClick} 
      />
      <h1 className="font-bold text-3xl text-white">Related Songs:</h1>
      <div className="mt-6 w-full flex flex-col">
        {data?.map((song, i) => (
          <SongBar
            key={`${artistId}-${song.key}-${i}`}
            song={song}
            i={i}
            artistId={artistId}
            isPlaying={isPlaying}
            activeSong={activeSong}
            handlePauseClick={handlePauseClick}
            handlePlayClick={() => handlePlayClick(song, i)}
          />
        ))}
      </div>
    </div>
  );
}

export default RelatedSongs;
