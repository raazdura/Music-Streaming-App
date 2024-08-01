import React, { useState, useEffect } from "react";

const UploadSong = () => {
  const [formData, setFormData] = useState({
    name: "",
    genres: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("genres", formData.genres);
      formDataToSend.append("image", formData.image);

      // Log the form data
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch("http://localhost:4000/api/artists", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Content posted successfully!");
        setFormData({
          name: "",
          genres: "",
          image: null,
        });
      } else {
        throw new Error("Failed to post content");
      }
    } catch (error) {
      console.error("Error posting content:", error);
      alert("Failed to post content. Please try again.");
    }
  };

  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/artists');
        const data = await response.json();
        setArtists(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        {artists?.map((artist, i) => (
            <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <div className="flex justify-center">
              <img className="w-24 h-24 rounded-full mt-4" src={`http://localhost:4000/api/${artist.imagepath}`} alt={artist.name} />
            </div>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-center">{artist.name}</div>
              <p className="text-gray-700 text-base text-center">Followers: {artist.followers}</p>
            </div>
          </div>
        ))}
        
      </div>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl text-center font-bold mb-6">Upload Artist</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="genres" className="block text-sm font-medium text-gray-700">
              Genres <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="genres"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upload Artist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadSong;
