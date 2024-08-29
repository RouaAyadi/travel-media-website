'use client';
import React, { useState, useEffect } from 'react';
import { useUserContext, uploadProfilePic, fetchMe } from '../../../store/User';
import PostProfile from './PostProfile';
import Navbar from './Navbar5';

const ProfilePage = ({ data, userID }) => {
  const { state, dispatch } = useUserContext();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const profileId = data?.id;
  const userIdFromLocalStorage = localStorage.getItem('user');
  const myUser = JSON.parse(userIdFromLocalStorage);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await fetchMe(dispatch);
        return currentUser;
      } catch (error) {
        console.error('Error fetching posts or user data:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (myUser && myUser.id == userID) {
      setIsOwnProfile(true);
    }
  }, [userID]);

  useEffect(() => {
    if (data && data.photo && data.photo.url) {
      setPreviewUrl(`${process.env.NEXT_PUBLIC_STRAPI_URL}${data.photo.url}`);
    }
  }, [data]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!state.isAuth || !isOwnProfile) {
      alert("You're not authorized to change this profile picture. Please log in.");
      return;
    }

    try {
      await uploadProfilePic(dispatch, { file, id: profileId });
      await fetchMe(dispatch);
      setFile(null);
      alert('Upload profile picture successfully.');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture.');
    }
  };

  const resetProfilePic = () => {
    setFile(null);
    setPreviewUrl(`${process.env.NEXT_PUBLIC_STRAPI_URL}${data.photo.url}` || '/default.webp');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-4 py-8 flex space-x-8 ">
        {/* Profile Section */}
        <div className=" bg-white p-6 rounded-lg shadow-lg max-w-xs">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={previewUrl || '/default.webp'}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:border-blue-500"
              />
              {isOwnProfile && (
                <>
                 <button
                    type="button"
                    onClick={() => document.getElementById('profile-pic').click()}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Edit Profile Image
                  </button>
                  <input
                    type="file"
                    id="profile-pic"
                    name="profile-pic-upload"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
                
              )}
            </div>
            {file && (
              <div className="mt-4">
                <>
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mr-2"
                  >
                    Save Profile Picture
                  </button>
                  <button
                    type="button"
                    onClick={resetProfilePic}
                    className="text-gray-600 hover:text-red-600 focus:outline-none"
                  >
                    Cancel
                  </button>
                </>
              </div>
            )}

            <h1 className="text-3xl font-bold">{data?.username}</h1>
            <p className="text-lg text-gray-600">{data?.first_name} {data?.last_name}</p>
            <p className="text-sm text-gray-500">{data?.Bio}</p>
            <div className="mt-4 w-full text-left">
              <h2 className="text-xl font-semibold text-gray-800">Contact & Media Links</h2>
              <div className="mt-2 text-sm text-gray-600">
                <div class="flex gap-2 w-full">
                  <div class="bg-gradient2 bg-opacity-10 h-[35px] w-[35px] flex justify-center items-center rounded">
                    <svg height="auto" width="auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#211C54" class="w-[14px] h-[14px]">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z">
                      </path>
                    </svg>
                  </div>
                    <div><p class="text-p2 text-neutral-500">Phone Number</p>
                      <p className="font-medium">{data?.phone_number}</p>
                    </div>
                </div>              
              </div>
            </div>
          </div>
        </div>
        

        {/* Posts Section */}
        <div className="w-2/3">
          <PostProfile data={data} userID={userID} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
