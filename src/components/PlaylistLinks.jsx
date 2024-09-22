import { MdOutlineLibraryMusic } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserQuery, useCreatePlaylistMutation } from '../redux/services/musicCore';
import { setUser } from '../redux/features/userSlice';

const PlaylistLinks = ({ handleClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const userid = user?._id;
  console.log(userid);

  // Create playlist mutation
  const [createPlaylist, { isLoading, isSuccess, error }] = useCreatePlaylistMutation();

  // Fetch user data to update the playlist state
  const { data: updatedUser, refetch } = useGetUserQuery(userid, { skip: !userid });

  const handleCreatePlaylist = async () => {
    if (!user?._id) {
      console.error('User ID is undefined. Cannot create playlist.');
      return;
    }

    try {
      const response = await createPlaylist({
        songid: `${user?.playlists.length + 1}`,
        userid: `${user._id}`,
      });

      console.log('Playlist created:', response);

      // Refetch user data to update playlists in the store
      refetch();
      
      // Optionally, you can dispatch the updated user info if necessary
      if (updatedUser) {
        dispatch(setUser(updatedUser));
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  return (
    <div className="mt-2 h-80 overflow-scroll">
      <div className="text-white font-bold text-xl flex items-center justify-between">
        <h1 className="flex items-center">
          <MdOutlineLibraryMusic className="mr-2 text-2xl" />
          Your Playlist
        </h1>
        <div className="p-2 hover:bg-slate-700 rounded-full cursor-pointer" onClick={handleCreatePlaylist}>
          <FiPlus />
        </div>
      </div>
      {user?.playlists?.map((playlist) => (
        <NavLink
          key={playlist._id}
          to={`/playlist/${playlist._id}`}
          end
          className={({ isActive }) =>
            isActive
              ? 'flex flex-row justify-start items-center my-8 text-sm font-medium text-cyan-400'
              : 'flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-cyan-400'
          }
          onClick={() => handleClick && handleClick()} // Optional onClick handler
        >
          {playlist.name}
        </NavLink>
      ))}
    </div>
  );
};

export default PlaylistLinks;
