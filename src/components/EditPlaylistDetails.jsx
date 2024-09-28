import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CoverArt from '../assets/love-logo-654.png';
import Profile from '../assets/profile.png';

import { 
  useGetPlaylistDetailsQuery, 
  useDeletePlaylistMutation, 
  useUpdatePlaylistMutation // Add your mutation for updating the playlist
} from '../redux/services/musicCore';

import { FiEdit2 } from "react-icons/fi";
import { AiOutlineClose } from 'react-icons/ai';  // For close button
import { RiErrorWarningLine } from "react-icons/ri";

const EditPlaylistDetails = ({ setEditMenu, playlistData}) => {
  const [name, setName] = useState(playlistData?.name || "");
  const [description, setDescription] = useState(playlistData?.description || "");
  const [coverImage, setCoverImage] = useState(CoverArt);  // Set default cover art or existing image
  const [selectedFile, setSelectedFile] = useState(null);  // Store the selected file
  const fileInputRef = useRef(null);

  const editMenuRef = useRef(null);
  const [updatePlaylist] = useUpdatePlaylistMutation();  // Use mutation for updating

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);  // Save the file to be sent in the form
      setCoverImage(URL.createObjectURL(file));  // Preview the image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      // Handle empty name error
      return;
    }

    // Create form data to send the image and other playlist details
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (selectedFile) {
      formData.append('coverImage', selectedFile);  // Add the image file if selected
    }

    try {
      // Send the updated data using the mutation
      await updatePlaylist({ playlistId: playlistData._id, formData });
      setEditMenu(false);  // Close the edit menu after successful update
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-30">
      <div ref={editMenuRef} className="bg-zinc-800 p-6 rounded-lg w-11/12 sm:w-2/3 lg:w-1/2 relative">
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-400"
          onClick={() => setEditMenu(false)}
        >
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-white text-xl font-bold mb-4">Edit details</h2>

        {/* Display error if name is empty */}
        <div className={`flex items-center bg-red-600 w-full text-black text-sm font-semibold rounded my-1 ${name ? 'hidden' : 'flex'}`}>
          <RiErrorWarningLine className='text-white m-1' size={22}/>
          <p>Playlist name is required.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='flex'>
          <div className="relative group mr-2">
            <div
              id='photo'
              className="absolute inset-0 flex-col justify-center items-center text-white 
                bg-black bg-opacity-50 hidden group-hover:flex cursor-pointer"
              onClick={() => fileInputRef.current.click()}  // Trigger input click when div is clicked
            >
              <FiEdit2 size={42} />
              <span>Choose photo</span>
            </div>
            
            {/* Image preview */}
            <img
              className="w-48 h-48 rounded-md object-cover shadow-l shadow-black"
              src={coverImage || "default-image-url"}  // Display the selected or default image
              alt="playlist cover"
            />
            
            {/* Hidden input for file selection */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}  // Hide the input element
            />
          </div>
            
            <div className='flex flex-col h-48 flex-grow ml-2'>
              <div className="mb-4">
                <input
                  type="text"
                  className="block w-full border-none text-white bg-stone-600 rounded-md p-2 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Add name'
                />
              </div>
              <div className="flex-grow">
                <textarea
                  className="block w-full h-full border-none text-white bg-stone-600 rounded-md p-2 outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Add description'
                />
              </div>
            </div>
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            className="bg-white mt-2 hover:bg-blue-700 text-black font-bold py-3 px-6 rounded-full float-right hover:bg-green-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPlaylistDetails;
