import React, { useState, useEffect, Fragment } from 'react';
import { useUserContext, uploadProfilePic, fetchMe } from '../../../store/User';
import SideNavbar from './navbar';
import PostModal from './PostModal';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { fetchPostsNById } from '../../../utils/user';
import { deleteTrip, editTrip, uploadMedia } from '../../../store/Trip';
import MapModal from './modalmap';
import EditModal from './EditModal';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from 'next/link';
import MapModal2 from './MapModal';




const PostProfile = ({ data, userID,pic }) => {
  const { state, dispatch } = useUserContext();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setEditShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [showMapModall, setShowMapModall] = useState(false);




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
        console.log(tripResp.data)
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
      setFile(null);
      alert('Upload profile picture successfully.');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture.');
    }
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

  const handleEditPost = async () => {
    if (!isOwnProfile) {
      alert("You're not authorized to edit this post.");
      return;
    }
    try {
      let mediaId;
      if (file) {
        const uploadResponse = await uploadMedia(dispatch, { file, id: editingPost });
        mediaId = uploadResponse?.data[0]?.id;
      }

      const updatedData = {
        ...newPostData,
        latitude: parseFloat(newPostData.latitude),
        longitude: parseFloat(newPostData.longitude),
        ...(mediaId && { media: mediaId }), // Only include media ID if uploaded
      };

      await editTrip(editingPost, updatedData);

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
    setEditShowModal(true);
  };

  const cancelEditing = () => {
    setEditingPost(null);
    setNewPostData({
      title: '',
      description: '',
      latitude: '',
      longitude: ''
    });
    setEditShowModal(false);
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
      <div className=" bg-white p-6 rounded-lg shadow-lg w-80 h-min left-10 fixed ml-16 mt-16	 ">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={previewUrl || '/default.webp'}
                alt="Profile"
                className="h-40 w-40 m-6 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:border-blue-500"
              />
              {isOwnProfile && (
                <>
                 <button
                    type="button"
                    onClick={() => document.getElementById('profile-pic').click()}
                    className="mt-2 ml-7 inline-flex items-center justify-center rounded-xl bg-blue-900 py-2 px-2 font-dm text-base font-medium text-white shadow-xl shadow-blue-400/75 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
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
      <div className="min-h-screen bg-gray-100">
      <img 
            src="image5.png" 
            alt="Top Image" 
            className="w-full px-6 h-72 object-cover rounded-lg mb-4" 
          />
        <div className="max-w-4xl mx-auto px-4 py-0 flex flex-col items-center">
          
          <div className="  p-4 rounded-lg flex flex-col w-2/3  ">
            <div className='bg-gray-100 pt-2'>
              <h2 className="text-xl font-semibold mb-4 text-center">
              {isOwnProfile && (
              <div className="mt-4 flex justify-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => state.isAuth && setShowModal(true)}>
              <div className="flex items-center space-x-4">
                <img
                  src="pic2.png"
                  className="w-16 h-16 transition-transform duration-300 hover:scale-110"
                  alt="Add New Post"
                />
                <span className="text-lg font-semibold text-gray-700">What's new ?</span>
              </div>
            </div>
            
            
            )}
              </h2>
            </div>
            {posts.map((post) => (
              <div key={post.id} className="relative flex flex-col bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 mb-4 w-1/ max-w-3xl">
                <div className="absolute top-2 right-2"> 
                {isOwnProfile && (
        
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 text-sm font-semibold text-gray-900 shadow-sm  hover:bg-gray-50">
                          ...
                        </MenuButton>
                      </div>

                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                        <div className="py-1">
                            <MenuItem>
                              <button
                              onClick={() => startEditingPost(post)}
                                type="submit"
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                              >
                                Edit
                              </button>
                            </MenuItem>
                            <MenuItem>
                              <button
                              onClick={() => handleDeletePost(post.id)}
                                type="submit"
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                              >
                                Delete
                              </button>
                            </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                  )}
                </div>
                { (
                  <div className="flex mb-4 relative">
                    <Link href={`/${post.user_profile.id}`} className="flex items-center space-x-4">
                <img
                  src={pic}
                  alt="User Profile"
                  className="h-12 w-12 rounded-full object-cover shadow-md"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {post.user_profile.first_name} {post.user_profile.last_name}
                  </h3>
                  <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-US',{ 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</div>
                </div>
              </Link>

                  </div>
                )}
                <div className='flex flex-col items-center'>
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>

                {Array.isArray(post.media) && post.media.length > 1 ? (
                  <Slider {...sliderSettings} className="relative w-full">
                    {post.media.map((media) => (
                      <div key={media.id} className="mb-4">
                        <img
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                          alt={media.name}
                          className="w-96 h-96 object-cover rounded-lg cursor-pointer"
                          onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : post.media && post.media.length > 0 ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.media[0].url}`}
                    alt="Post"
                    className="w-96 h-96 object-cover rounded-lg cursor-pointer"
                    onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.media[0].url}`)}
                  />
                ) : (
                  <div className="w-96 h-96 bg-gray-200 rounded-lg"></div>
                )}
                </div>
                <div className="w-1/2 pl-4">
                  <p className="text-gray-700 my-4 ">{post.description}</p>
                  
                  <button 
                      onClick={() => state.isAuth && setShowMapModall(true)} 
                      className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-300"
                    >
                      <span className="text-sm font-medium">View on Map</span>
                    </button>

                        <MapModal2
                          isVisible={showMapModall}
                          onClose={() => setShowMapModall(false)}
                          longitude={post.longitude}
                          latitude={post.latitude}

                          />
                </div>
              </div>
              
            ))}
          </div>
          
          <EditModal
            isVisible={showEditModal}
            onClose={cancelEditing}
            newPostData={newPostData}
            onSave={handleEditPost}
            onInputChange={handleInputChange}
            onLocationSelect={handleLocationSelect}
            handleFileChange={handleEditPost}
          />
          <MapModal
            isVisible={showMapModal}
            onClose={() => setShowMapModal(false)}
            onLocationSelect={handleLocationSelect}
          />
          {selectedMedia && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
              onClick={closeModal}
            >
              <img
                src={selectedMedia}
                alt="Selected Media"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
        
      </div>
      
      <PostModal
        isVisible={showModal}
        id={profileId}
        onClose={() => setShowModal(false)}
        steps={editingPost ? posts.find(post => post.id === editingPost)?.steps || [] : []}
      />

      

    </Fragment>
  );
};

export default PostProfile;
