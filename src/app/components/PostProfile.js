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
import ProfileComponent from './ProfileComponent';
import MapPage from './MapPage';




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
  const [selectedPost, setSelectedPost] = useState(null);


const handleViewOnMap = (post) => {
  setSelectedPost(post);
  setShowMapModall(true);
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
        console.log(tripResp.data)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [profileId]);

  const resetProfilePic = () => {
    setFile(null);
    setPreviewUrl(`${process.env.NEXT_PUBLIC_STRAPI_URL}${data.photo.url}` || '/default.webp');
  };

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
      <div className="  p-6 rounded-lg shadow-lg w-80 h-min left-10 fixed ml-16 mt-16	 ">
          <ProfileComponent
          previewUrl={previewUrl}
          isOwnProfile={isOwnProfile}
          handleFileChange={handleFileChange}
          file={file}
          handleUpload={handleUpload}
          resetProfilePic={resetProfilePic}
          data={data}
          />
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
  onClick={() => state.isAuth && handleViewOnMap(post)} 
  className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-300"
>
  <span className="text-sm font-medium">View on Map</span>
</button>

                        {/* <MapModal2
                          isVisible={showMapModall}
                          onClose={() => setShowMapModall(false)}
                          longitude={post.longitude}
                          latitude={post.latitude}

                          /> */}
                          {selectedPost && (
  <MapPage
    isVisible={showMapModall}
    onClose={() => setShowMapModall(false)}
    trip={selectedPost}
  />
)}
                          
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
