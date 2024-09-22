import React from 'react';
import SongBar from './SongBar';
import PlayAll from '../components/PlayAll';

const RelatedSongs = ({ data, artistId, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => (
  <div className="flex flex-col">
    <PlayAll type="artist" data artistId isPlaying activeSong handlePauseClick handlePlayClick />
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
          handlePlayClick={handlePlayClick}
        />
      ))}
    </div>
  </div>
);

export default RelatedSongs;