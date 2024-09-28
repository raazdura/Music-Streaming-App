import React, { useState } from 'react';
import { MdOutlineLibraryMusic } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserQuery, useCreatePlaylistMutation } from '../redux/services/musicCore';
import CoverArt from '../assets/love-logo-654.png';

import PlaylistLinks from "./PlaylistLinks";
import FollowingArtistsLinks from "./FollowingArtistsLinks";
import { Button } from '@mui/material';

const YourLibrary = () => {
  
  const [libraryOption, setLibraryOption] = useState("playlists");

  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [createPlaylist, { isLoading, isSuccess, error }] = useCreatePlaylistMutation();

  // Fetch user data to update the playlist state
  const { data: updatedUser, refetch } = useGetUserQuery({ userid: user?._id,  skip: !user?._id });
  console.log(updatedUser?.playlists)

  const handleCreatePlaylist = async () => {
    if (!user?._id) {
      console.error('User ID is undefined. Cannot create playlist.');
      return;
    }

    try {
      const response = await createPlaylist({
        songid: `${updatedUser?.playlists.length + 1}`,
        userid: `${updatedUser._id}`,
      });

      console.log('Playlist created:', response);

      refetch();
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  return (
    <div className="">
      <div className="text-white font-bold text-xl flex items-center justify-between border-t-2 border-zinc-500">
        <h1 className="flex items-center text-xl my-4  ">
          <MdOutlineLibraryMusic className="mr-2 text-3xl" />
          Your Library
        </h1>
        <div className="p-2 hover:bg-slate-700 rounded-full cursor-pointer" onClick={handleCreatePlaylist}>
          <FiPlus />
        </div>
      </div>
      <div className="flex font-semibold text-sm text-center p-2">
        <span
          className={`px-4 py-2 mr-2 border-white border-2 rounded-full cursor-default ${libraryOption === 'playlists' ? 'bg-white text-black' : 'text-white'}`}
          onClick={() => setLibraryOption('playlists')}
        >
          Playlists
        </span>
        <span
          className={`px-4 py-2 border-white border-2 rounded-full cursor-default ${libraryOption === 'artists' ? 'bg-white text-black' : 'text-white'}`}
          onClick={() => setLibraryOption('artists')}
        >
          Artists
        </span>
      </div>
      {isAuthenticated ?
        libraryOption === 'playlists' ? <PlaylistLinks /> : <FollowingArtistsLinks />
      : (
        <div className="text-white text-2xl">
          log in to view your playlists
        </div>
      )
      }
    </div>
  );
};

export default YourLibrary;
