import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import Boudha from '../assets/Bouddha.jpg';

import PlayPause from '../components/PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetTopChartsQuery } from '../redux/services/musicCore';

import { IoMdPlay } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaListUl } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { TiDeleteOutline } from "react-icons/ti";

const PlaylistSongCard = ({ song, i, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {

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
            <HiDotsHorizontal className='hover:pointer text-white text-lg '  onClick={toggleDropdown} />
            
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
                    className='absolute -left-full top-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform' >
                    <div className='border-b-2 border-slate-600'>
                      <a href="/profile" className='flex px-2 py-2 text-white hover:bg-gray-600 rounded'>
                        <IoIosAdd className='text-2xl mr-2' />
                        Create new playlist
                      </a>
                    </div>
                    {/* <span className='border-2 h-52 border-slate-600'></span> */}
                    <div>
                    <a href="/profile" className='flex px-2 py-2 text-white hover:bg-gray-600 rounded'>
                      Playlist 01
                    </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )
  }
  

const PlaylistDetails = () => {
  const { id: playlistId } = useParams();
  console.log(playlistId);
//   const { activeSong, isPlaying } = useSelector((state) => state.player);
//   const { data: playlistData, isFetching: isFetchingPlaylistDetails, error } = useGetArtistDetailsQuery(plalyistId);

//   console.log(playlistData);
  // console.log(artistData.name);

//   if (isFetchingPlaylsitDetails) return <Loader title="Loading playlist details..." />;

//   if (error) return <Error />;

const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data } = useGetTopChartsQuery();
//   const divRef = useRef(null);

//   useEffect(() => {
//     divRef.current.scrollIntoView({ behavior: 'smooth' });
//   });

  const topPlays = data?.slice(0, 5);
  // console.log(topPlays);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

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

  return (
    <div className="mt-10">
        <div className="relative w-full">
            {/* <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h-28" /> */}

            <div className="flex items-end pb-6">
                <img
                    alt="playlist cover"
                    // src={`http://localhost:4000/api/${playlistData?.imagepath}`}
                    src={Boudha} 
                    className="sm:w-48 w-28 sm:h-48 h-28 rounded-md object-cover shadow-l shadow-black"
                />

                <div className="ml-5 text-white flex flex-col h-full">
                    <p className=''>Playlist</p>
                    <p className="font-bold text-6xl">
                    {/* {artistId ? artistData?.name : songData?.title} */}
                    Playlist O1
                    </p>
                    <p className='mb-2 font-bold text-slate-400'>Discription</p>
                    <div className='flex '>
                        <a href="#" className='flex items-center'>
                            <img src={Boudha} className='w-8 h-8 rounded-full' alt="photo" />
                            <span className='font-bold ml-2 hover:underline'> Artist name</span>
                        </a>
                        <span className=' flex items-center'><BsDot className='text-lg' />1001 saves</span>
                        <span className=' flex items-center'><BsDot className='text-lg' />120  songs</span>
                        <span className=' flex items-center text-slate-400'><BsDot className='text-lg' />12 hrs</span>
                    </div>
                    {/* {!artistId && (
                    <Link to={`/artists/${songData?.artists[0]}`}>
                        <p className="text-base text-gray-400 mt-2">{songData?.subtitle}</p>
                    </Link>
                    )}

                    <p className="text-base text-gray-400 mt-2">
                    {artistId
                        ? artistData?.genres[0]
                        : songData?.genres[0]}
                    </p> */}
                </div>
            </div>
        </div>

        <div className='bg-black bg-opacity-50 rounded-2xl w-full'>
            <div className='flex justify-between p-4 mx-4  items-center border-b-2 border-slate-600'>
                <div className='flex items-center'>
                    <div className='p-4 bg-green-500 rounded-full'>
                        <IoMdPlay className='text-3xl text-black' />
                    </div>
                    <IoIosAddCircleOutline className='text-slate-400 hover:text-white text-3xl ml-6 hover'  />
                    <div className='relative'>
                        <HiDotsHorizontal className='text-white text-2xl ml-6'  onClick={toggleMenu} />

                        {showMenu && (
                            <div ref={menuRef}
                                className='absolute right-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform' >
                                <a href="#" className='flex px-2 py-2 text-white hover:bg-gray-600 rounded' onClick={toggleMenu}>
                                <GoPencil className='text-2xl mr-2' />
                                Edit Details
                                </a>
                                <a href="#" className='flex px-2 py-2 text-white hover:bg-gray-600 rounded' onClick={toggleMenu}>
                                <TiDeleteOutline className='text-2xl mr-2' />
                                Delete
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className='flex items-center text-slate-400 hover:text-white'>
                    <span>List</span>
                    <FaListUl className='text-xl ml-2 ' />
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-1">
                {topPlays?.map((song, i) => (
                    <PlaylistSongCard
                        key={song.key || i}
                        song={song}
                        i={i}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        handlePauseClick={handlePauseClick}
                        handlePlayClick={() => handlePlayClick(song, i)}
                    />
                ))}
            </div>

        </div>
    </div>
  );
};

export default PlaylistDetails;