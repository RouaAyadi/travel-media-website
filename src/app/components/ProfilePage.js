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
  const [posts, setPosts] = useState([]);


  
  const handleSearch = (results) => {
    setPosts(results); // Update the trips state with the search results
  };

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
    <Navbar pic={previewUrl} fn={data?.first_name} ln={data?.last_name} trips={posts} onSearch={handleSearch}/> 
    <div className="py-10"></div>     
    <div className=" mx-auto px-4 py-8  flex space-x-8">
      
        {/* Profile Section */}
        
        
        {/* Posts Section */}
        <div className=" w-full">
          <PostProfile data={data} userID={userID} posts={posts} pic={previewUrl} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
