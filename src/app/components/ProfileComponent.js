'use client';
import React, { useState, useEffect } from 'react';

const ProfileComponent = ({ previewUrl, isOwnProfile, handleFileChange, file, handleUpload, resetProfilePic, data }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to track if the profile image is being edited

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startEditing = () => {
    // Trigger file input click when the "Edit Profile Image" button is clicked
    document.getElementById('profile-pic').click();
  };

  const stopEditing = () => {
    setIsEditing(false); // Stop editing when cancelled
    resetProfilePic(); // Reset the file input
  };

  const onFileChange = (event) => {
    handleFileChange(event); // Handle the file change
    setIsEditing(true); // Start editing after the file is selected
  };

  return (
    <div
      className={`flex flex-col items-center space-y-4 bg-white p-3 rounded-lg shadow-md-gray fixed top-[200px] left-20 ml-9 w-[300px] z-50 transition-transform duration-300 ease-in-out ${
        scrolled ? '-translate-y-12' : 'translate-y-0'
      }`}
    >
      <div className="relative">
        <img
          src={previewUrl || '/default.webp'}
          alt="Profile"
          className="h-40 w-40 m-6 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:border-blue-500"
        />
        {isOwnProfile && !isEditing && (
          <button
            type="button"
            onClick={startEditing} // Trigger file selection
            className="mt-2 ml-7 inline-flex items-center justify-center rounded-xl bg-blue-900 py-2 px-2 font-dm text-base font-medium text-white shadow-xl shadow-blue-400/75 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
          >
            Edit Profile Image
          </button>
        )}
        {isEditing && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                handleUpload();
                setIsEditing(false); // Stop editing after saving
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mr-2"
            >
              Save Profile Picture
            </button>
            <button
              type="button"
              onClick={stopEditing} // Stop editing and reset when cancelled
              className="text-gray-600 hover:text-red-600 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        )}
        <input
          type="file"
          id="profile-pic"
          name="profile-pic-upload"
          onChange={onFileChange} // Handle file change and start editing
          className="hidden"
        />
      </div>

      <h1 className="text-3xl font-bold">{data?.username}</h1>
      <p className="text-lg text-gray-600">{data?.first_name} {data?.last_name}</p>
      <p className="text-sm text-gray-500">{data?.Bio}</p>
      <div className="mt-4 w-full text-left">
        <h2 className="text-xl font-semibold text-gray-800 ml-8">Contact & Media Links</h2>
        <div className="mt-2 text-sm text-gray-600">
          <div className="flex gap-2 w-full">
            <div className="bg-gradient2 bg-opacity-10 h-[35px] w-[35px] flex justify-center items-center rounded">
              <svg height="auto" width="auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#211C54" className="w-[14px] h-[14px]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
              </svg>
            </div>
            <div>
              <p className="text-p2 text-neutral-500">Phone Number</p>
              <p className="font-medium">{data?.phone_number}</p>
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <div class="flex gap-2 w-full">
            <div class="bg-gradient2 bg-opacity-10 h-[35px] w-[35px] flex justify-center items-center rounded">
              <svg height="auto" width="auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#211C54" class="w-[14px] h-[14px]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75v10.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 6.75zM21 6.75l-9 6-9-6" />
              </svg>
            </div>

            <div><p class="text-p2 text-neutral-500">Email</p>
              <p className="font-medium">{data?.user?.email}</p>
            </div>
          </div>              
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
