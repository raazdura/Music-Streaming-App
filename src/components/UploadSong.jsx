import React, { useState } from "react";

const UploadSong = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    artists: "",
    album: "",
    uniqueKey: "",
    coverart: null,
    streamUrl: null,
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
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("artists", formData.artists);
      formDataToSend.append("album", formData.album);
      formDataToSend.append("uniqueKey", formData.uniqueKey);
      formDataToSend.append("coverart", formData.coverart);
      formDataToSend.append("streamUrl", formData.streamUrl);

      console.log(formDataToSend);

      const response = await fetch("http://localhost:4000/api/song", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Content posted successfully!");
        // Optionally reset form fields after successful submission
        setFormData({
          title: "",
          subtitle: "",
          artists: "",
          album: "",
          uniqueKey: "",
          coverart: null,
          streamUrl: null,
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
      <h2 className="text-2xl text-center font-bold mb-6">Upload Song</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields for song metadata */}
        {/* Input field for Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Input field for Subtitle */}
        <div className="mb-4">
          <label
            htmlFor="subtitle"
            className="block text-sm font-medium text-gray-700"
          >
            Subtitle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
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

        {/* Input field for Album */}
        <div className="mb-4">
          <label
            htmlFor="album"
            className="block text-sm font-medium text-gray-700"
          >
            Album
          </label>
          <input
            type="text"
            id="album"
            name="album"
            value={formData.album}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Input field for Unique Key */}
        <div className="mb-4">
          <label
            htmlFor="uniqueKey"
            className="block text-sm font-medium text-gray-700"
          >
            Unique Key <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="uniqueKey"
            name="uniqueKey"
            value={formData.uniqueKey}
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

        {/* Input field for Stream URL */}
        <div className="mb-4">
          <label
            htmlFor="streamUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Stream URL <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="streamUrl"
            name="streamUrl"
            onChange={handleChange}
            accept=".mp3" // Accept only MP3 files
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

export default UploadSong;
