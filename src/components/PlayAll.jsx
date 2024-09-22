import React, { useRef, useEffect, useState } from 'react';


import { IoMdPlay } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaListUl } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { TiDeleteOutline } from "react-icons/ti";

import { useFollowArtistQuery } from '../redux/services/musicCore';

const PlayAll = ({ type ,data, artistId, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {
//     const { id: playlistId } = useParams();
//   console.log(playlistId);
//   const { activeSong, isPlaying } = useSelector((state) => state.player);
//   const { data: playlistData, isFetching: isFetchingPlaylistDetails, error } = useGetArtistDetailsQuery(plalyistId);

//   console.log(playlistData);
  // console.log(artistData.name);

//   if (isFetchingPlaylsitDetails) return <Loader title="Loading playlist details..." />;

//   if (error) return <Error />;

// const dispatch = useDispatch();
//   const { activeSong, isPlaying } = useSelector((state) => state.player);
//   const { data } = useGetTopChartsQuery();
//   const divRef = useRef(null);

//   useEffect(() => {
//     divRef.current.scrollIntoView({ behavior: 'smooth' });
//   });

//   const topPlays = data?.slice(0, 5);
  // console.log(topPlays);
  const user = JSON.parse(localStorage.getItem('user'));

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

  const follows = user?.followedArtists?.includes(artistId) ? true : false;

  const handleFollow = () => {
    const { response } = useFollowArtistQuery({ userid: user?._id, artistId });

  }

    return (
        <div className='flex justify-between p-4 mb-2  items-center border-b-2 border-slate-600'>
                <div className='flex items-center'>
                    <div className='p-4 bg-green-500 rounded-full cursor-pointer'>
                        <IoMdPlay className='text-3xl text-black' />
                    </div>
                    { type === "artist" ? (
                         follows == true ? (<span className='text-white ml-6 border-2 rounded-full cursor-pointer border-white p-4' >
                            Following
                        </span>) : 
                        (<span className='text-white ml-6 border-2 rounded-full cursor-pointer border-white p-4'onClick={handleFollow} >
                            Follow
                        </span>)
                    ) : (
                        <IoIosAddCircleOutline className='text-slate-400 hover:text-white text-3xl ml-6 cursor-pointer' />
                    )}
                    <div className='relative'>
                        <HiDotsHorizontal className='text-white text-2xl ml-6 cursor-pointer'  onClick={toggleMenu} />

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
                
                {/* <div className='flex items-center text-slate-400 hover:text-white'>
                    <span>List</span>
                    <FaListUl className='text-xl ml-2 ' />
                </div> */}
        </div>
    )
}

export default PlayAll;