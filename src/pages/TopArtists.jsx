import React from 'react';

import { ArtistCard, Error, Loader } from '../components';
import { useGetTopArtistsQuery } from '../redux/services/musicCore';

const TopArtists = () => {
  const { data, isFetching, error } = useGetTopArtistsQuery();

  if (isFetching) return <Loader title="Loading artists..." />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Top artists</h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.map((artist) => <ArtistCard key={artist._id} artist={artist} />)}
      </div>
    </div>
  );
};

export default TopArtists;