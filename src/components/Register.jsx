import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdNotificationsOutline } from "react-icons/io";
import Boudha from '../assets/Bouddha.jpg';

const Register = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
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
    <>
      {isLoggedIn ? (
        <div id='loggedIn' className='flex flex-row items-center'>
          <IoMdNotificationsOutline 
            className='w-10 h-10 p-2 mr-2 text-white hover:bg-black rounded-full'
          />
          <div className='relative'>
            <img 
              src={Boudha} 
              alt="user profile"
              className='w-10 h-10 rounded-full border-solid border-4 border-black pointer cursor-pointer'
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div
                ref={dropdownRef}
                className='absolute right-0 mt-2 w-52 bg-gray-800 rounded-md shadow-lg p-1 z-20 transition duration-300 ease-in-out transform'
              >
                <a href="/profile" className='block px-2 py-2 text-white hover:bg-gray-600 rounded'>Profile</a>
                <a href="/settings" className='block px-2 py-2 text-white hover:bg-gray-600 rounded'>Settings</a>
                <a href="/logout" className='block px-2 py-2 text-white hover:bg-gray-600 rounded'>Logout</a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id='notLoggedIn' className='flex flex-row items-center'>
          <button
            onClick={() => handleNavigate('/signup')}
            className='capitalize rounded-2xl p-2 px-4 text-lg font-bold text-gray-300 
              hover:text-white'
          >
            Signup
          </button>
          <button 
            onClick={() => handleNavigate('/login')}
            className='capitalize bg-white rounded-2xl p-2 px-4 text-lg font-bold text-black
            hover:bg-gray-200'
          >
            Login
          </button>
        </div>
      )}
    </>
  );
};

export default Register;
