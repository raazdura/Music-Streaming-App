import { MdOutlineLibraryMusic } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserQuery, useCreatePlaylistMutation } from '../redux/services/musicCore';
import CoverArt from '../assets/love-logo-654.png';

const PlaylistLinks = ({ handleClick }) => {
  const { user } = useSelector((state) => state.user);

  const [createPlaylist, { isLoading, isSuccess, error }] = useCreatePlaylistMutation();

  // Fetch user data to update the playlist state
  const { data: updatedUser, refetch } = useGetUserQuery({ userid: user?._id,  skip: !user?._id });

  const handleCreatePlaylist = async () => {
    if (!user?._id) {
      console.error('User ID is undefined. Cannot create playlist.');
      return;
    }

    try {
      const response = await createPlaylist({
        songid: `${updatedUser?.playlists.length + 1}`,
        userid: `${updatedUser._id}`,
      });

      console.log('Playlist created:', response);

      refetch();
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  return (
    <div className="mt-2">
       { 
        updatedUser?.playlists?.map((playlist) => (
          // <div className="flex items-center w-full hover">
            
            <NavLink
            key={playlist._id}
            to={`/playlist/${playlist._id}`}
            end
            className={({ isActive }) =>
              isActive
                ? 'flex flex-row justify-start items-center my-2 p-1 rounded-lg  text-lm font-medium text-white bg-zinc-700 bg-opacity-40'
                : 'flex flex-row justify-start items-center my-2 p-1 rounded-lg  text-lm font-medium text-white hover:bg-zinc-700 bg-opacity-40'
            }
            onClick={() => handleClick && handleClick()} // Optional onClick handler
          >
            <div id="coverart" className="bg-white  w-16 h-16 rounded-lg mr-2">
              <img src={playlist?.coverart ? `http://localhost:4000/api/${playlist?.coverart}` : CoverArt} alt="playlist cover"
              className="w-full h-full rounded-lg" />
            </div>
            {playlist.name}
            </NavLink>
          // </div>
        ))
      }
    </div>
  );
};

export default PlaylistLinks;
