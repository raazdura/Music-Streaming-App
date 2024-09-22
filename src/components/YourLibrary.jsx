import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineHashtag, HiOutlineHome, HiOutlineMenu, HiOutlineUserGroup } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';

const playlists = [
  { name: 'Playlist 01', to: '/', icon: HiOutlineHome },
  { name: 'Playlist 02', to: '/top-artists', icon: HiOutlineUserGroup },
  { name: 'Playlist 03', to: '/top-charts', icon: HiOutlineHashtag },
];


const NavLinks = ({ handleClick }) => (
  <div className="mt-10">
    {playlists.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        end
        className={({ isActive }) =>
          isActive
            ? 'flex flex-row justify-start items-center my-8 text-sm font-medium text-cyan-400'
            : 'flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-cyan-400'
        }
        onClick={() => handleClick && handleClick()}
      >
        <item.icon className="w-6 h-6 mr-2" />
        {item.name}
      </NavLink>
    ))}
  </div>
);

const YourLibrary = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="md:flex hidden flex-col w-[200px] py-8 px-4 bg-[#191624]">
        {/* <img src={logo} alt="logo" className="w-full h-14 object-contain" /> */}
        {/* <a href='/'>
            <h1 className="text-white font-bold text-3xl text-center p-2 m-2 ">
                Music <br/>
                <p className="text-sm">Streaming App</p>
            </h1>
        </a> */}
        <NavLinks />
      </div>

      {/* Mobile sidebar */}
      {/* <div className="absolute md:hidden block top-5 right-3">
        {!mobileMenuOpen ? (
          <HiOutlineMenu className="w-7 h-7 mr-2 text-white" onClick={() => setMobileMenuOpen(true)} />
        ) : (
          <RiCloseLine className="w-7 h-7 mr-2 text-white" onClick={() => setMobileMenuOpen(false)} />
        )}
      </div> */}

      {/* <div className={`absolute top-0 h-screen w-2/4 bg-gradient-to-tl from-white/10 to-[#483D8B] 
        backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
        <img src={logo} alt="logo" className="w-full h-14 object-contain" />
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div> */}
    </>
  );
};

export default YourLibrary;