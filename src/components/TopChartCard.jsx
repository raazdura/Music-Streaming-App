import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import PlayPause from "../components/PlayPause";

import { useSelector } from "react-redux";
import {
  useGetUserQuery,
  useCreatePlaylistMutation,
  useAddSongToPlaylistMutation,
} from "../redux/services/musicCore";

import 'swiper/css';
import 'swiper/css/free-mode';

import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";

const TopChartCard = ({ song, i, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {
    const { user } = useSelector((state) => state.user);
    const [createPlaylist] = useCreatePlaylistMutation();
    const [addSongToPlaylist] = useAddSongToPlaylistMutation();
    const { data: updatedUser, refetch } = useGetUserQuery({ userid: user?._id, skip: !user?._id, });

    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };
  
    const addPlaylistRef = useRef(null);
    const [showAddPlaylist, setShowAddPlaylist] = useState(false);
    const toggleAddPlaylist = () => {
      setShowAddPlaylist(!showAddPlaylist);
    };
  
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if ( addPlaylistRef.current && !addPlaylistRef.current.contains(event.target)) {
        setShowAddPlaylist(false);
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
          
          setShowDropdown(false);
          setShowAddPlaylist(false);
          console.log("Playlist created:", response);
          console.log("Updated User:", updatedUser);
    
        } catch (err) {
          console.error("Error creating playlist:", err);
        }
    };

    const handleAddTOPlaylist = async (id) => {
        console.log(id);
    
        try {
          const response = await addSongToPlaylist({
            playlistid: id,
            songid: song._id,
          });

          setShowDropdown(false);
          setShowAddPlaylist(false);
    
          console.log(response);
        } catch (err) {
          console.error('Error adding song to playlist:', err);
        }
    }
  
    return (
        <div className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${activeSong?.title === song?.title ? 'bg-[#4c426e]' : 'bg-transparent'} py-2 p-4 rounded-lg cursor-pointer mb-2`}>
          <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
          <div className="flex-1 flex flex-row justify-between items-center">
            
          <div className="relative group">
              <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.title === song.title ? 'flex bg-black bg-opacity-70' : 'hidden'}`}>
                <PlayPause
                  isPlaying={isPlaying}
                  activeSong={activeSong}
                  song={song}
                  handlePause={handlePauseClick}
                  handlePlay={handlePlayClick}
                />
              </div>
              {/* <img alt="song_img" src={`http://localhost:4000/api/${song.album.image}`} className="w-full h-full rounded-lg" /> */}
      
              <img className="w-16 h-16 rounded-lg" src={`http://localhost:4000/api/${song?.album?.image}` } alt={song?.title} />
            </div>
      
      
            <div className="flex-1 flex flex-col justify-center mx-3">
              <Link to={`/songs/${song._id}`}>
                <p className="text-l font-bold text-white">
                  {song?.title}
                </p>
              </Link>
              <Link to={`/artists/${song?.artists[0]?._id}`}>
                <p className="text-sm text-gray-300 mt-1">
                  {song.artists[0].name}
                </p>
              </Link>
            </div>
          </div>
              
          <div className='relative'>
            <BsThreeDotsVertical className='hover:pointer text-white text-lg '  onClick={toggleDropdown} />
            
            {showDropdown && (
              <div
                ref={dropdownRef}
                className='absolute right-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform' >
                <a href="#" className='flex px-2 py-2 text-white hover:bg-gray-600 rounded' onClick={toggleAddPlaylist}>
                  <IoIosAdd className='text-2xl mr-2' />
                  Add to playlist
                </a>
  
                {showAddPlaylist && (
              <div
                ref={addPlaylistRef}
                className="absolute -left-full top-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform"
              >
                <div className="border-b-2 border-slate-600 flex px-2 py-2 text-white hover:bg-gray-600 rounded"
                    onClick={handleCreatePlaylist}>
                    <IoIosAdd className="text-2xl mr-2" />
                    Create new playlist
                </div>
                <div>
                  {updatedUser?.playlists?.map((playlist) => (
                    <span
                      href="/profile"
                      className="flex px-2 py-2 text-white hover:bg-gray-600 rounded"
                      onClick={() => handleAddTOPlaylist(playlist._id)}
                    >
                      {playlist.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
              </div>
            )}
          </div>
        </div>
      )
}

  export default TopChartCard;