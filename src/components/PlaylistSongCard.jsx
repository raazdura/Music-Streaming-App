import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import PlayPause from "../components/PlayPause";
import { playPause, setActiveSong, } from '../redux/features/playerSlice';
import {
  useGetUserQuery,
  useCreatePlaylistMutation,
  useAddSongToPlaylistMutation,
  useRemoveSongFromPlaylistMutation,
} from "../redux/services/musicCore";

import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosAdd } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";

const PlaylistSongCard = ({
  song,
  i,
  isPlaying,
  activeSong,
  playlistData,
  refetchPlaylistDetails,
}) => {
  const data = playlistData.tracks;
  const { user } = useSelector((state) => state.user);
  const [createPlaylist] = useCreatePlaylistMutation();
  const [addSongToPlaylist] = useAddSongToPlaylistMutation();
  const [removeSongFromPlaylist] = useRemoveSongFromPlaylistMutation();
  const { updatedUser, refetch } = useGetUserQuery({
    userid: user?._id,
    skip: !user?._id,
  });

  const dispatch = useDispatch();

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {

    console.log(data);
  
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  // Handling playlist creation
  const handleCreatePlaylist = async () => {
    if (!user?._id) {
      console.error("User ID is undefined. Cannot create playlist.");
      return;
    }

    try {
      const response = await createPlaylist({
        songid: `${song._id}`,
        userid: `${updatedUser._id}`,
      });
      refetch();
      console.log("Playlist created:", response);
      console.log("Updated User:", updatedUser);
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  // Handling song addition to playlist
  const handleAddSongToPlaylist = async (playlistId) => {
    try {
      const response = await addSongToPlaylist({
        playlistid: playlistData._id,
        songid: song._id,
      });
      refetch();
      setDropdownState({ showDropdown: false, showAddPlaylist: false });
      console.log(response);
    } catch (err) {
      console.error("Error adding song to playlist:", err);
    }
  };

  // Handling song removal from playlist
  const handleRemoveSongFromPlaylist = async () => {
    try {
      const response = await removeSongFromPlaylist({
        playlistid: playlistData._id,
        songid: song._id,
      });
      refetch();
      refetchPlaylistDetails();
      setDropdownState({ showDropdown: false, showAddPlaylist: false });
      console.log(response);
    } catch (err) {
      console.error("Error removing song from playlist:", err);
    }
  };

  const dropdownRef = useRef(null);
  const addPlaylistRef = useRef(null);
  const [dropdownState, setDropdownState] = useState({
    showDropdown: false,
    showAddPlaylist: false,
  });

  const toggleDropdown = () =>
    setDropdownState((prev) => ({ ...prev, showDropdown: !prev.showDropdown }));
  const toggleAddPlaylist = () =>
    setDropdownState((prev) => ({
      ...prev,
      showAddPlaylist: !prev.showAddPlaylist,
    }));

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownState({ showDropdown: false, showAddPlaylist: false });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = activeSong?.title === song?.title;

  return (
    <div
      className={`w-full flex flex-row items-center ${
        isActive ? "bg-[#4c426e]" : "hover:bg-[#4c426e] bg-transparent"
      } py-2 p-4 rounded-lg cursor-pointer mb-2`}
    >
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
      <div className="flex-1 flex flex-row justify-between items-center">
        <div className="relative group">
          <div
            className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
              isActive ? "flex bg-black bg-opacity-70" : "hidden"
            }`}
          >
            <PlayPause
              isPlaying={isPlaying}
              activeSong={activeSong}
              song={song}
              handlePause={handlePauseClick}
              handlePlay={handlePlayClick}
            />
          </div>
          <img
            className="w-16 h-16 rounded-lg"
            src={`http://localhost:4000/api/${song?.album[0]?.image}`}
            alt={song?.title}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center mx-3">
          <Link to={`/songs/${song._id}`}>
            <p className="text-l font-bold text-white">{song?.title}</p>
          </Link>
          <Link to={`/artists/${song?.artists[0]?._id}`}>
            <p className="text-sm text-gray-300 mt-1">{song.artists[0]?.name}</p>
          </Link>
        </div>
      </div>

      <div className="relative">
        <HiDotsHorizontal
          className="hover:pointer text-white text-lg"
          onClick={toggleDropdown}
        />
        {dropdownState.showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform"
          >
            <div
              className="flex px-2 py-2 text-white hover:bg-gray-600 rounded"
              onClick={toggleAddPlaylist}
            >
              <IoIosAdd className="text-2xl mr-2" />
              Add to playlist
            </div>

            <div
              className="flex px-2 py-2 text-white hover:bg-gray-600 rounded"
              onClick={handleRemoveSongFromPlaylist}
            >
              <IoTrashBinOutline className="text-2xl mr-2" />
              Remove from playlist
            </div>

            {dropdownState.showAddPlaylist && (
              <div
                ref={addPlaylistRef}
                className="absolute -left-full top-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform"
              >
                <div
                  className="border-b-2 border-slate-600 flex px-2 py-2 text-white hover:bg-gray-600 rounded"
                  onClick={handleCreatePlaylist}
                >
                  <IoIosAdd className="text-2xl mr-2" />
                  Create new playlist
                </div>
                <div>
                  {updatedUser?.playlists?.length > 0 ? (
                    updatedUser.playlists.map((playlist) => (
                      <span
                        key={playlist._id}
                        className="flex px-2 py-2 text-white hover:bg-gray-600 rounded"
                        onClick={() => handleAddSongToPlaylist(playlist._id)}
                      >
                        {playlist.name}
                      </span>
                    ))
                  ) : (
                    <span className="flex px-2 py-2 text-gray-500">
                      No playlists available
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistSongCard;
