import { MdOutlineLibraryMusic } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserQuery, useCreatePlaylistMutation } from '../redux/services/musicCore';
import Profile from '../assets/profile.png';

const FollowingArtistsLinks = ({ handleClick }) => {
  const { user } = useSelector((state) => state.user);

  const [createPlaylist, { isLoading, isSuccess, error }] = useCreatePlaylistMutation();

  // Fetch user data to update the playlist state
  const { data: updatedUser, refetch } = useGetUserQuery({ userid: user?._id,  skip: !user?._id });
  console.log(updatedUser.followings);

  return (
    <div className="mt-2">
       { 
        updatedUser?.followings?.map((artist) => (
            <NavLink
            key={artist._id}
            to={`/artist/${artist._id}`}
            end
            className={({ isActive }) =>
              isActive
                ? 'flex flex-row justify-start items-center my-2 p-1 rounded-lg  text-lm font-medium text-white bg-zinc-700 bg-opacity-40'
                : 'flex flex-row justify-start items-center my-2 p-1 rounded-lg  text-lm font-medium text-white hover:bg-zinc-700 bg-opacity-40'
            }
            onClick={() => handleClick && handleClick()} // Optional onClick handler
          >
            <div className="bg-white w-16 h-16 rounded-full overflow-hidden">
              <img src={artist?.imagepath ? `http://localhost:4000/api/${artist?.imagepath}`  : Profile} alt="artist cover" />
            </div>
            {artist.name}
            </NavLink>
        ))
      }
    </div>
  );
};

export default FollowingArtistsLinks;
