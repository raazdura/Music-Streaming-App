/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetTopChartsQuery } from '../redux/services/musicCore';

import 'swiper/css';
import 'swiper/css/free-mode';

import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";


const TopChartCard = ({ song, i, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {

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

const TopPlay = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data } = useGetTopChartsQuery();
  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  const topPlays = data?.slice(0, 5);
  // console.log(topPlays);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div ref={divRef} className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[380px] max-w-full flex flex-col">
      <div className="w-full flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Charts</h2>
          <Link to="/top-charts">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {topPlays?.map((song, i) => (
            <TopChartCard
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

      <div className="w-full flex flex-col mt-8">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Artists</h2>
          <Link to="/top-artists">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4"
        >
          {topPlays?.slice(0, 5).map((artist) => (
            <SwiperSlide
              key={artist?.key}
              style={{ width: '18%', height: 'auto' }}
              className="shadow-lg rounded-full animate-slideright"
            >
              <Link to={`/artists/${artist?.artists[0]?._id}`}>
                <img src={`http://localhost:4000/api/${artist?.artists[0]?.imagepath}`} alt="Name" className="rounded-full w-full object-cover" />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TopPlay;