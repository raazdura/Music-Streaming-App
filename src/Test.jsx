import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CoverArt from '../assets/love-logo-654.png';
import Profile from '../assets/profile.png';

import PlaylistSongCard from '../components/PlaylistSongCard';
import { Error, Loader } from "../components";


import PlayPause from "../components/PlayPause";
import { playPause, setActiveSong, } from '../redux/features/playerSlice';

import { 
  useGetPlaylistDetailsQuery, 
  useDeletePlaylistMutation, 
} from '../redux/services/musicCore';

import { IoMdPlay } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsDot } from "react-icons/bs";
import { GoPencil } from "react-icons/go";
import { TiDeleteOutline } from "react-icons/ti";
import { FiEdit2 } from "react-icons/fi";

const PlaylistDetails = () => {
  const { id: playlistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data: playlistData, isFetching: isFetchingPlaylistDetails, error, refetch: refetchPlaylistDetails } = useGetPlaylistDetailsQuery(playlistId);
  // console.log(playlistData);
  
  const navigate = useNavigate();
  const [deletePlaylist] = useDeletePlaylistMutation();

  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [editMenu, setEditMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleEditMenu = () => {
    setEditMenu(!editMenu);
  }

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    await deletePlaylist({ playlistid: playlistId });
    refetch();
    navigate('/');
  };

  if (isFetchingPlaylistDetails) return <Loader title="Loading playlist details..." />;
  if (error) return <Error />;

  return (
    <div className="mt-10">
      <div className="relative w-full">
        <div className="flex items-end pb-6">
          <div className="relative group">
            <div className="absolute inset-0 flex-col justify-center items-center text-white 
              bg-black bg-opacity-50 hidden group-hover:flex" >
                <FiEdit2 size={42} />
                <span>Choose photo</span>
            </div>
            <img
              className="sm:w-48 w-28 sm:h-48 h-28 rounded-md object-cover shadow-l shadow-black"
              src={CoverArt}
              alt="playlist cover"
            />
          </div>

          <div className="ml-5 text-white flex flex-col h-full">
            <p className="">Playlist</p>
            <p className="font-bold text-6xl">{playlistData?.name}</p>
            <p className="mb-2 font-bold text-slate-400">{playlistData?.description}</p>
            <div className="flex">
              <a href="#" className="flex items-center">
                <img
                  src={playlistData?.owner?.photo ? playlistData?.owner?.photo : Profile}
                  className="w-8 h-8 rounded-full"
                  alt="photo"
                />
                <span className="font-bold ml-2 hover:underline">{playlistData?.owner?.username}</span>
              </a>
              <span className="flex items-center">
                <BsDot className="text-lg" />
                {playlistData?.saves ? playlistData?.saves : 0} Saves
              </span>
              <span className="flex items-center">
                <BsDot className="text-lg" />
                {playlistData?.tracks?.length} Songs
              </span>
              <span className="flex items-center text-slate-400">
                <BsDot className="text-lg" />12 hrs
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black bg-opacity-50 rounded-2xl w-full">
        <div className="flex justify-between p-4 mx-4 items-center border-b-2 border-slate-600">
          <div className="flex items-center">
            <div className="p-4 bg-green-500 rounded-full">
              <IoMdPlay className="text-3xl text-black" />
            </div>
            <IoIosAddCircleOutline className="text-slate-400 hover:text-white text-3xl ml-6" />
            <div className="relative">
              <HiDotsHorizontal className="text-white text-2xl ml-6" onClick={toggleMenu} />
              {showMenu && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform"
                >
                  <span href="#" className="flex px-2 py-2 text-white hover:bg-gray-600 rounded" onClick={toggleEditMenu}>
                    <GoPencil className="text-2xl mr-2" />
                    Edit Details
                  </span>
                  <span href="#" className="flex px-2 py-2 text-white hover:bg-gray-600 rounded" onClick={handleDelete}>
                    <TiDeleteOutline className="text-2xl mr-2" />
                    Delete
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {playlistData?.tracks?.map((song, i) => (
            <PlaylistSongCard
              key={song.key || i}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              playlistData = {playlistData}
              refetchPlaylistDetails = {refetchPlaylistDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;