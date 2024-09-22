import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Searchbar, Sidebar, MusicPlayer, TopPlay } from './components';
import { ArtistDetails, TopArtists, Discover, Search, SongDetails, TopCharts, Artists } from './pages';
import Register from './components/Register';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';

import { setUser } from './redux/features/userSlice';
import PlaylistDetails from './pages/PlaylistDetails';
import Profile from './pages/Profile';

import { useGetUserQuery } from './redux/services/musicCore';

const App = () => {
  const dispatch = useDispatch();

  // const token = localStorage.getItem('userToken');
  // const usersaved = JSON.parse(localStorage.getItem('user'));
  
  // if (token && usersaved) {
  //   const { user, token } = useGetUserQuery(usersaved?._id);
  //   dispatch(setUser({ user, token }));
  // }

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (token && user) {
      dispatch(setUser({ user, token }));
    }
  }, [dispatch]);

  const { activeSong } = useSelector((state) => state.player);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="relative flex">
      {!isAuthPage && <Sidebar />}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286] w-full">
        {!isAuthPage && (
          <div className='flex justify-between px-6 mr-10 md:mr-0'>
            <Searchbar />
            <Register />
          </div>
        )}

        <div className={`${!isAuthPage ? 'px-4 h-[calc(100vh-72px)]' : 'h-screen'} overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse`}>
          <div className={`flex-1 h-fit ${!isAuthPage && 'pb-40'}`}>
            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/top-artists" element={<TopArtists />} />
              <Route path="/top-charts" element={<TopCharts />} />
              <Route path="/artists/:id" element={<ArtistDetails />} />
              <Route path="/songs/:songid" element={<SongDetails />} />
              <Route path="/playlist/:id" element={<PlaylistDetails />} />
              <Route path="/search/:searchTerm" element={<Search />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
          {!isAuthPage && (
            <div className="xl:sticky relative top-0 h-fit">
              <TopPlay />
            </div>
          )}
        </div>
      </div>

      {!isAuthPage && activeSong?.title && (
        <div className="absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-t-3xl z-10">
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default App;
