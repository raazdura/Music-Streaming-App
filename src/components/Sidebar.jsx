import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineHashtag, HiOutlineHome, HiOutlineMenu, HiOutlineUserGroup } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';

import { logo } from '../assets';

import YourLibrary from './YourLibrary';

const links = [
  { name: 'Discover', to: '/', icon: HiOutlineHome },
  { name: 'Top Artists', to: '/top-artists', icon: HiOutlineUserGroup },
  { name: 'Top Charts', to: '/top-charts', icon: HiOutlineHashtag },
];


const NavLinks = ({ handleClick }) => (
  <div className="mt-4">
    {links.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        end
        className={({ isActive }) =>
          isActive
            ? 'flex flex-row justify-start items-center my-2 px-2 py-3 text-sm rounded-lg font-medium text-white bg-zinc-700 bg-opacity-40'
            : 'flex flex-row justify-start items-center my-2 px-2 py-3 text-sm rounded-lg font-medium text-white hover:bg-zinc-700 bg-opacity-40'
        }
        onClick={() => handleClick && handleClick()}
      >
        <item.icon className="w-6 h-6 mr-2" />
        {item.name}
      </NavLink>
    ))}
  </div>
);

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="md:flex hidden flex-col w-[250px] px-2 bg-[#191624] h-screen overflow-scroll hide-scrollbar">
        {/* <img src={logo} alt="logo" className="w-full h-14 object-contain" /> */}
        <a href='/' className='bg-inherit sticky top-0 py-2'>
            <h1 className="text-white font-bold text-3xl text-center p-2 m-2">
                Music <br/>
                <p className="text-sm">Streaming App</p>
            </h1>
        </a>
        <NavLinks />
        <YourLibrary />
      </div>

      {/* Mobile sidebar */}
      <div className="absolute md:hidden block top-5 right-3">
        {!mobileMenuOpen ? (
          <HiOutlineMenu className="w-7 h-7 mr-2 text-white" onClick={() => setMobileMenuOpen(true)} />
        ) : (
          <RiCloseLine className="w-7 h-7 mr-2 text-white" onClick={() => setMobileMenuOpen(false)} />
        )}
      </div>

      <div className={`absolute top-0 h-screen w-2/4 bg-gradient-to-tl from-white/10 to-[#483D8B] 
        backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
        <img src={logo} alt="logo" className="w-full h-14 object-contain" />
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;