import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineHashtag, HiOutlineHome, HiOutlineMenu, HiOutlineUserGroup } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';

import { logo } from '../assets';

import PlaylistLinks from './PlaylistLinks';

const links = [
  { name: 'Discover', to: '/', icon: HiOutlineHome },
  { name: 'Top Artists', to: '/top-artists', icon: HiOutlineUserGroup },
  { name: 'Top Charts', to: '/top-charts', icon: HiOutlineHashtag },
];


const NavLinks = ({ handleClick }) => (
  <div className="mt-8">
    {links.map((item) => (
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

// const playlists = [
//   { name: 'playlist 01', to: '/playlist/playlist 01'},
//   { name: 'Top Artists', to: '#'},
//   { name: 'Top Charts', to: '#'},
// ];


// const PlaylistLinks = ({ handleClick }) => {
//   const [createPlaylist, { isLoading, isSuccess, data, error }] = useCreatePlaylistMutation();
//   const navigate = useNavigate();

//   const { user } = useSelector((state) => state.user);
//   // console.log(user);
//   // console.log(user?.playlists);

//   const handleCreatePlaylist = async () => {
//     try {
//       const response = await createPlaylist({ songid: `${user?.playlists.length + 1}`, userid: `${user._id}` });

//       const updatedUser = await useGetUserQuery(user?._id);
//       console.log(updatedUser);


//       console.log('Playlist created:', response);
//     } catch (error) {
//       console.error('Error creating playlist:', error); 
//     }
//   };

//   return (
//     <div className="mt-2">
//       <div className="text-white font-bold text-xl flex items-center justify-between">
//         <h1 className=" flex items-center">
//             <MdOutlineLibraryMusic className='mr-2 text-2xl' />
//           Your Playlist 
//           </h1>
//           <div className='p-2 hover:bg-slate-700 rounded-full cursor-pointer' onClick={handleCreatePlaylist}>
//             <FiPlus />
//           </div>
//       </div>
//       {user?.playlists.map((playlist) => (
//         <NavLink
//         key={playlist.id} // Use playlist.id as the unique key
//         to={`/playlist/${playlist._id}`} // Dynamically generate the route using playlist ID
//         end
//         className={({ isActive }) =>
//           isActive
//             ? 'flex flex-row justify-start items-center my-8 text-sm font-medium text-cyan-400'
//             : 'flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-cyan-400'
//         }
//         onClick={() => handleClick && handleClick()} // Optional onClick handler
//       >
//         {playlist.name}
//       </NavLink>
//       ))}
//     </div>
//   );
// }

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="md:flex hidden flex-col w-[250px] py-4 px-2 bg-[#191624]">
        {/* <img src={logo} alt="logo" className="w-full h-14 object-contain" /> */}
        <a href='/'>
            <h1 className="text-white font-bold text-3xl text-center p-2 m-2 ">
                Music <br/>
                <p className="text-sm">Streaming App</p>
            </h1>
        </a>
        <NavLinks />
        <PlaylistLinks />
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