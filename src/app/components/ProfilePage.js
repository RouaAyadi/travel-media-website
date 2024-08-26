'use client';
import React, { useState, useEffect, Fragment } from 'react';
import { useUserContext, uploadProfilePic, fetchMe } from '../../../store/User';
import SideNavbar from './navbar';
import PostModal from './PostModal';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { fetchPostsNById } from '../../../utils/user';
import { deleteTrip, editTrip , uploadMedia } from '../../../store/Trip';
import MapModal from './modalmap';
import Navbar5 from './Navbar5';

const ProfilePage = ({ data, userID }) => {
  const { state, dispatch } = useUserContext();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);

  const handleSearch = (results) => {
    setPosts(results); // Update the trips state with the search results
  };


  const [newPostData, setNewPostData] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
  });

  const profileId = data?.id;
  const userIdFromLocalStorage = localStorage.getItem('user');
  const myUser = JSON.parse(userIdFromLocalStorage);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const tripResp = await fetchPostsNById(profileId);
        setPosts(tripResp.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        
      }
    };

    fetchPosts();
  }, [profileId]);

  useEffect(() => {
    if (hasEdited) {
      const fetchUpdatedPosts = async () => {
        try {
          const tripResp = await fetchPostsNById(profileId);
          setPosts(tripResp.data);
          setHasEdited(false); // Reset the flag after fetching
        } catch (error) {
          console.error('Error fetching updated posts:', error);
        }
      };
  
      fetchUpdatedPosts();
    }
  }, [hasEdited, profileId]);
  

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
      // Fetch the updated profile data
      await fetchMe(dispatch);
      // setPreviewUrl(updatedUser.photo.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${updatedUser.photo.url}` : '/default.webp');
      setFile(null);
      alert('upload profile picture successfully.');

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture.');
    }
  };

  const resetProfilePic = () => {
    setFile(null);
    setPreviewUrl(`${process.env.NEXT_PUBLIC_STRAPI_URL}${data.photo.url}` || '/default.webp');
  };

  const handleMediaClick = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const handleDeletePost = async (postId) => {
    if (!isOwnProfile) {
      alert("You're not authorized to delete this post.");
      return;
    }

    try {
      await deleteTrip(postId);
      setPosts(posts.filter((post) => post.id !== postId));
      alert('Post successfully deleted.');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleEditPost = async (postId) => {
    if (!isOwnProfile) {
      alert("You're not authorized to edit this post.");
      return;
    }
    try {
      let mediaId;
      if (file) {
        const uploadResponse = await uploadMedia(dispatch, { file, id: postId });
        mediaId = uploadResponse?.data[0]?.id;
      }
  
      const updatedData = {
        ...newPostData,
        latitude: parseFloat(newPostData.latitude),
        longitude: parseFloat(newPostData.longitude),
        ...(mediaId && { media: mediaId }), // Only include media ID if uploaded
      };
  
      await editTrip(postId, updatedData);
  
      setHasEdited(true); // Trigger the useEffect to re-fetch posts
  
      setEditingPost(null);
      setFile(null); // Clear the file input after upload
      alert('Post successfully updated.');
    } catch (error) {
      console.error('Error editing post:', error);
      alert('Failed to update post.');
    }
  };
  
  
  


  const handleLocationSelect = (location) => {
    setNewPostData({
      ...newPostData,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  const startEditingPost = (post) => {
    setEditingPost(post.id);
    setNewPostData({
      title: post.title,
      description: post.description,
      latitude: post.latitude || '',
      longitude: post.longitude || '',
    });
  };

  const cancelEditing = () => {
    setEditingPost(null);
    setNewPostData({
      title: '',
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPostData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };


  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', left: '80px', zIndex: 1 }}
        onClick={onClick}
      />
    );
  };

  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', right: '80px', zIndex: 1 }}
        onClick={onClick}
      />
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    appendDots: (dots) => (
      <div style={{ position: 'relative', top: '-20px' }}>
        <ul style={{ margin: '0px' }}>{dots}</ul>
      </div>
    ),
  };

  return (
    <Fragment>
      <Navbar5 pic={previewUrl} fn={data?.first_name} ln={data?.last_name} trips={posts} onSearch={handleSearch}/>
    <div className='pb-20'></div>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={previewUrl || '/default.webp'}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:border-blue-500"
                onClick={() => isOwnProfile && document.getElementById('profile-pic').click()}
              />
              {isOwnProfile && (
                <label
                  htmlFor="profile-pic"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-opacity-50 hover:bg-black transition duration-300 rounded-full"
                >
                  <span className="sr-only">Change Profile Picture</span>
                </label>
              )}
              <input
                type="file"
                id="profile-pic"
                name="profile-pic-upload"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{data?.username}</h1>
              <p className="text-lg text-gray-600">{data?.first_name} {data?.last_name}</p>
              <p className="text-sm text-gray-500">{data?.Bio}</p>
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
                  {!state.isAuth && (
                    <p className="text-gray-500">Log in to update your profile picture.</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 border border-gray-200 p-4 rounded-lg flex flex-col bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">My Posts</h2>
            {posts.map((post) => (
              <div key={post.id} className="flex bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 mb-4 items-start w-full max-w-3xl">
                {Array.isArray(post.media) && post.media.length > 1 ? (
                  <Slider {...sliderSettings} className="relative w-1/2">
                    {post.media.map((media) => (
                      <div key={media.id} className="mb-2">
                        {media.mime.startsWith('image/') ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                            alt={post.title}
                            className="w-full h-auto object-cover rounded-lg cursor-pointer"
                            onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                          />
                        ) : (
                          <video
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                            className="w-full h-auto object-cover rounded-lg cursor-pointer"
                            controls
                            onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                          />
                        )}
                      </div>
                    ))}
                  </Slider>
                ) : (
                  Array.isArray(post.media) && post.media.map((media) => (
                    <div key={media.id} className="w-1/2 mb-2">
                      {media.mime.startsWith('image/') ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                          alt={post.title}
                          className="w-full h-auto object-cover rounded-lg cursor-pointer"
                          onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                        />
                      ) : (
                        <video
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                          className="w-full h-auto object-cover rounded-lg cursor-pointer"
                          controls
                          onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                        />
                      )}
                    </div>
                  ))
                )}
                <div className="w-1/2 p-4 text-left">
                  {editingPost === post.id ? (
                    <div>
                      <input
                        type="text"
                        name="title"
                        value={newPostData.title}
                        onChange={handleInputChange}
                        className="block w-full mb-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Title"
                      />
                      <textarea
                        name="description"
                        value={newPostData.description}
                        onChange={handleInputChange}
                        className="block w-full mb-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Description"
                        rows="4"
                      />
                      <input
                        type="text"
                        name="latitude"
                        value={newPostData.latitude}
                        onChange={handleInputChange}
                        className="block w-full mb-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Latitude"
                      />
                      <input
                        type="text"
                        name="longitude"
                        value={newPostData.longitude}
                        onChange={handleInputChange}
                        className="block w-full mb-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Longitude"
                      />

                      {/* Add the media file input here */}
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        onChange={(e) => handleFileChange(e)} 
                        className="block w-full mb-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />



                      <button
                        type="button"
                        onClick={() => handleEditPost(post.id)}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mr-2"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="text-gray-600 hover:text-red-600 focus:outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMapModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-2"
                      >
                        Edit Location
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800 font-semibold text-lg mb-2">{post.title}</p>
                      <p className="bg-gray-100 p-4 rounded-lg shadow-md leading-relaxed break-words overflow-wrap">
                        {post.description}
                      </p>

                      {isOwnProfile && (
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => startEditingPost(post)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <MapModal
                  isVisible={showMapModal}
                  onClose={() => setShowMapModal(false)}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
            ))}
            {isOwnProfile && (
              <div className="mt-4 flex justify-center">
                <img
                  src="pic2.png"
                  className="w-16 h-16 flex items-center cursor-pointer transition-transform duration-300 hover:scale-110"
                  onClick={() => state.isAuth && setShowModal(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
          onClick={closeModal}
        >
          <div className="relative">
            <button
              className="absolute top-0 right-0 m-4 text-white text-3xl"
              onClick={closeModal}
            >
              &times;
            </button>
            {selectedMedia.endsWith('.mp4') ? (
              <video
                src={selectedMedia}
                className="w-96 h-96 object-cover rounded-lg"
                controls
                autoPlay
              />
            ) : (
              <img
                src={selectedMedia}
                alt="Enlarged"
                className="w-96 h-96 object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      )}
      <PostModal
        isVisible={showModal}
        id={profileId}
        onClose={() => setShowModal(false)}
        steps={editingPost ? posts.find(post => post.id === editingPost)?.steps || [] : []}
      />
    </Fragment>
  );
};

export default ProfilePage;
