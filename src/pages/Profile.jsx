import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfilePic from '../assets/profile.png';
import CoverArt from '../assets/music-logo-png-2359.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';

import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetUserQuery, useGetTopChartsQuery } from '../redux/services/musicCore';

import { HiDotsHorizontal } from "react-icons/hi";
import { BsDot } from "react-icons/bs";
import { GoPencil } from "react-icons/go";
import { FaCopy } from "react-icons/fa";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const { data: updatedUser, refetch } = useGetUserQuery({ userid: user?._id,  skip: !user?._id });
  console.log(updatedUser);
  const { data } = useGetTopChartsQuery();
  const topPlays = data?.slice(0, 5);


  const { activeSong, isPlaying } = useSelector((state) => state.player);
//   const divRef = useRef(null);

//   useEffect(() => {
//     divRef.current.scrollIntoView({ behavior: 'smooth' });
//   });

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
                    src={updatedUser?.image ? 'http://localhost:4000/api/public/images/albums/updatedUser?.image' : ProfilePic} 
                    className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover shadow-l shadow-black"
                />

                <div className="ml-5 text-white flex flex-col h-full">
                    <p className=''>Profile</p>
                    <p className="font-bold text-6xl">
                    {/* {playlistId ? artistData?.name : songData?.title} */}
                    {updatedUser?.username}
                    </p>
                    <div className='flex mt-4'>
                        <span className='flex items-center text-slate-400'>{updatedUser?.playlists.length + 1} Public Playlist</span>
                        <span className='flex items-center'><BsDot className='text-lg' />{updatedUser?.followers?.length || 0} Followers</span>
                        <span className='flex items-center'><BsDot className='text-lg' />{updatedUser?.following?.length || 0} Followings</span>
                    </div>
                </div>
            </div>
        </div>

        <div className='bg-black bg-opacity-50 rounded-2xl w-full'>
            <div className='flex justify-between p-4 mx-4  items-center'>
                <div className='flex items-center'>
                    <div className='relative'>
                        <HiDotsHorizontal className='text-white text-2xl ml-6'  onClick={toggleMenu} />

                        {showMenu && (
                            <div ref={menuRef}
                                className='absolute left-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform' >
                                <a href="#" className='flex px-2 py-2 text-white hover:bg-gray-600 rounded' onClick={toggleMenu}>
                                  <GoPencil className='text-2xl mr-2' />
                                  Edit Details
                                </a>
                                <a href="#" className='flex px-2 py-2 text-white hover:bg-gray-600 rounded' onClick={toggleMenu}>
                                  <FaCopy className='text-2xl mr-2' />
                                  Copy Profile Link
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col my-10">
                <div className="flex flex-row justify-between items-center">
                <h2 className="text-white font-bold text-2xl m-4">Public Playlist</h2>
                <Link to="/top-artists">
                <p className="text-gray-300 text-base cursor-pointer">See more</p>
                </Link>
              </div>

              <Swiper
                slidesPerView="auto"
                // spaceBetween={0}
                freeMode
                centeredSlides
                centeredSlidesBounds
                modules={[FreeMode]}
                className="mt-4"
              >
              {updatedUser?.playlists?.slice(0, 4).map((playlist) => (
                    <SwiperSlide
                      key={playlist?.key}
                      style={{ width: '23%', height: 'auto' }}
                      className="shadow-lg rounded-lg animate-slideright p-3 mx-2 hover:bg-gray-700"
                    >
                    <Link to={`/playlists/${playlist?.playlists?._id}`}>
                      <img src={playlist?.coverart ? `http://localhost:4000/api/${playlist?.playlists?.imagepath}` : CoverArt} alt="Name" 
                      className="rounded-lg w-full object-cover bg-white" />
                    </Link>
                    <div className='mt-2'>
                      <span className='text-white'>{playlist?.name}</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="w-full flex flex-col my-10">
                <div className="flex flex-row justify-between items-center">
                <h2 className="text-white font-bold text-2xl m-4">Followings</h2>
                <Link to="/top-artists">
                <p className="text-gray-300 text-base cursor-pointer">See more</p>
                </Link>
              </div>

              <div className='m-2'>
                <Swiper
                  slidesPerView="auto"
                  freeMode
                  centeredSlides
                  centeredSlidesBounds
                  modules={[FreeMode]}
                >
                {topPlays?.slice(0, 4).map((artist) => (
                    <SwiperSlide
                        key={artist?.key}
                        style={{ width: '25%', height: 'auto' }}
                        className="shadow-lg rounded-lg animate-slideright p-3 hover:bg-gray-700"
                      >
                      <Link to={`/artists/${artist?.artists[0]?._id}`}>
                        <img src={`http://localhost:4000/api/${artist?.artists[0]?.imagepath}`} alt="Name" 
                        className="rounded-full w-full object-cover" />
                      </Link>
                      <div className='mt-2'>
                       <span className='text-white'>{artist?.artists[0]?.name}</span>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            <div className="w-full flex flex-col my-10">
                <div className="flex flex-row justify-between items-center">
                <h2 className="text-white font-bold text-2xl m-4">Followers</h2>
                <Link to="/top-artists">
                <p className="text-gray-300 text-base cursor-pointer">See more</p>
                </Link>
              </div>

              <div className='m-2'>
                <Swiper
                  slidesPerView="auto"
                  freeMode
                  centeredSlides
                  centeredSlidesBounds
                  modules={[FreeMode]}
                >
                {topPlays?.slice(0, 4).map((artist) => (
                      <SwiperSlide
                        key={artist?.key}
                        style={{ width: '25%', height: 'auto' }}
                        className="shadow-lg rounded-lg animate-slideright p-3 hover:bg-gray-700"
                      >
                      <Link to={`/artists/${artist?.artists[0]?._id}`}>
                        <img src={`http://localhost:4000/api/${artist?.artists[0]?.imagepath}`} alt="Name" 
                        className="rounded-full w-full object-cover" />
                      </Link>
                      <div className='mt-2'>
                       <span className='text-white'>{artist?.artists[0]?.name}</span>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
        </div>

    </div>
  );
};

export default Profile;