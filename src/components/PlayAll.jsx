import React, { useRef, useEffect, useState, useCallback } from 'react';
import { IoMdPlay } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaListUl } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { TiDeleteOutline } from "react-icons/ti";
import { useSelector } from 'react-redux';
import { useGetUserQuery, useFollowArtistMutation, useUnfollowArtistMutation } from '../redux/services/musicCore';

const PlayAll = ({ type, artistId }) => {
  const { user } = useSelector((state) => state.user);
  const { data: updatedUser, refetch } = useGetUserQuery({
    userid: user?._id, 
    skip: !user?._id,
  });

  const [followedArtist] = useFollowArtistMutation();
  const [unfollowArtist] = useUnfollowArtistMutation();

  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  // Toggle menu function with useCallback
  const toggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  // Handle clicks outside the dropdown to close it
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Follow/unfollow logic refactored
  const handleFollowToggle = async (isFollowing) => {
    try {
      const mutationFn = isFollowing ? unfollowArtist : followedArtist;
      const response = await mutationFn({
        artistid: artistId,
        userid: user?._id,
      });

      refetch();
      console.log(response);
    } catch (err) {
      console.error('Error following/unfollowing the artist:', err);
    }
  };

  const isFollowing = updatedUser?.followings?.includes(artistId);
  // console.log(isFollowing);
  // console.log(updatedUser?.followings);

  return (
    <div className='flex justify-between p-4 mb-2 items-center border-b-2 border-slate-600'>
      <div className='flex items-center'>
        <div className='p-4 bg-green-500 rounded-full cursor-pointer'>
          <IoMdPlay className='text-3xl text-black' />
        </div>

        {type === "artist" ? (
          isFollowing ? (
            <span 
              className='text-white ml-6 border-2 rounded-full cursor-pointer border-white p-2' 
              onClick={() => handleFollowToggle(true)}
            >
              Following
            </span>
          ) : (
            <span 
              className='text-white ml-6 border-2 rounded-full cursor-pointer border-white p-2' 
              onClick={() => handleFollowToggle(false)}
            >
              Follow
            </span>
          )
        ) : (
          <IoIosAddCircleOutline className='text-slate-400 hover:text-white text-3xl ml-6 cursor-pointer' />
        )}

        <div className='relative'>
          <HiDotsHorizontal className='text-white text-2xl ml-6 cursor-pointer' onClick={toggleMenu} />
          {showMenu && (
            <div 
              ref={menuRef} 
              className='absolute right-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform'
            >
              <a href="#" className='flex px-2 py-2 text-white hover:bg-gray-600 rounded' onClick={toggleMenu}>
                <GoPencil className='text-2xl mr-2' /> Edit Details
              </a>
              <a href="#" className='flex px-2 py-2 text-white hover:bg-gray-600 rounded' onClick={toggleMenu}>
                <TiDeleteOutline class            ='text-2xl mr-2' /> Delete
          </a>
        </div>
      )}
    </div>
  </div>

  {/* Uncomment this section if you want to add the "List" icon */}
  {/* 
  <div className='flex items-center text-slate-400 hover:text-white'>
    <span>List</span>
    <FaListUl className='text-xl ml-2 ' />
  </div> 
  */}
</div>

  )
}

export default PlayAll;