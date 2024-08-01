import React, { useState } from "react";

const Album = () => {
  const [formData, setFormData] = useState({
    name: "",
    album_type: "",
    artists: "",
    total_tracks: "",
    coverart: null,
  });

  // Function to handle changes in form fields
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle file inputs differently
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: e.target.files[0], // Store the file object
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("album_type", formData.album_type);
      formDataToSend.append("artists", formData.artists);
      formDataToSend.append("total_tracks", formData.total_tracks);
      formDataToSend.append("coverart", formData.coverart);

      console.log(formDataToSend);

      const response = await fetch("http://localhost:4000/api/albums", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Content posted successfully!");
        // Optionally reset form fields after successful submission
        setFormData({
          name: "",
          album_type: "",
          artists: "",
          total_tracks: "",
          coverart: null,
        });
      } else {
        throw new Error("Failed to post content");
      }
    } catch (error) {
      console.error("Error posting content:", error);
      alert("Failed to post content. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl text-center font-bold mb-6">Upload Album</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields for song metadata */}
        {/* Input field for name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            name <span className="text-red-500">*</span>
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

        {/* Input field for album_type */}
        <div className="mb-4">
          <label
            htmlFor="album_type"
            className="block text-sm font-medium text-gray-700"
          >
            album_type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="album_type"
            name="album_type"
            value={formData.album_type}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Input field for Artists */}
        <div className="mb-4">
          <label
            htmlFor="artists"
            className="block text-sm font-medium text-gray-700"
          >
            Artists
          </label>
          <input
            type="text"
            id="artists"
            name="artists"
            value={formData.artists}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Input field for Unique Key */}
        <div className="mb-4">
          <label
            htmlFor="total_tracks"
            className="block text-sm font-medium text-gray-700"
          >
           Total Tracks <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="total_tracks"
            name="total_tracks"
            value={formData.total_tracks}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Input field for Cover Art */}
        <div className="mb-4">
          <label
            htmlFor="coverart"
            className="block text-sm font-medium text-gray-700"
          >
            Cover Art <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="coverart"
            name="coverart"
            onChange={handleChange}
            accept="image/*" // Accept only image files
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload Song
          </button>
        </div>
      </form>
    </div>
  );
};

export default Album;
