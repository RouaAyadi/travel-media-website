'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchTripStepsByTripId } from "../../../utils/user";
import StepCard from './StepCard';
import { fetchMe2 } from '../../../store/User';
import { fetchLikesByTripId } from "../../../utils/user";


const PostCard = ({ trips }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState({});
  const [descriptionHeights, setDescriptionHeights] = useState({});
  const [stepsData, setStepsData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [modalData, setModalData] = useState([]); // User IDs
  const [userDetails, setUserDetails] = useState({}); // Key: userId, Value: user details
  const [likesData,setLikesData]=useState({});


  useEffect(() => {
    const fetchLikesForTrips = async () => {
      const likesForTrips = {};
      for (const trip of trips) {
        try {
          const likes = await fetchLikesByTripId(trip.id);
          console.log("likesssss",likes)
          likesForTrips[trip.id] = likes;
        } catch (error) {
          console.error(`Error fetching steps for trip ${trip.id}:`, error);
        }
      }
      setLikesData(likesForTrips);
      console.log("likesdata",likesForTrips)
    };

    fetchLikesForTrips();
  }, [trips]);

    
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await fetchMe2(); // Fetch user data
        setCurrentUser(user); // Set the user in local state
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchStepsForTrips = async () => {
      const stepsForTrips = {};
      for (const trip of trips) {
        try {
          const steps = await fetchTripStepsByTripId(trip.id);
          stepsForTrips[trip.id] = steps;
        } catch (error) {
          console.error(`Error fetching steps for trip ${trip.id}:`, error);
        }
      }
      setStepsData(stepsForTrips);
    };

    fetchStepsForTrips();
  }, [trips]);

  useEffect(() => {
    const heights = {};
    trips.forEach((trip) => {
      const el = document.getElementById(`description-${trip.id}`);
      if (el) {
        heights[trip.id] = el.scrollHeight;
      }
    });
    setDescriptionHeights(heights);
  }, [trips]);


 // Fetch likes data



  const handleMediaClick = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const toggleDescription = (tripId) => {
    setExpandedDescription((prevState) => ({
      ...prevState,
      [tripId]: !prevState[tripId],
    }));
  };

  const handleLike = async (tripId) => {
    if (!currentUser) {
      console.error("User not authenticated.");
      return;
    }
  
    try {
      // Fetch likes for the specific trip and user
      const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips/${tripId}?populate[likes]=*`);
      const likes = response.data.data.likes || [];
      console.log("inside handle",likes)

      
      // Ensure both IDs are treated as numbers for accurate comparison
      const currentUserId = Number(currentUser.id);

    // Filter likes to find if the current user has already liked the trip
    const existingLike = likes.find(like => Number(like.attributes?.user?.data?.id) === currentUserId);
    const likeId = existingLike ? existingLike.id : null;

    if (likeId) {
      // Unlike the trip if the user has already liked it
      await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/likes/${likeId}`);
      console.log("Like removed");
    } else {
      // Like the trip if the user has not liked it
      await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/likes`, {
        data: { trip: tripId, user: currentUser.id }
      });
      console.log("Like added");
    }
  } catch (error) {
    console.error("Error updating like status:", error);
  }
};
  
  
  
  const closeLikesModal = () => {
    setShowLikesModal(false);
  };

  

  const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          background: 'transparent',
          borderRadius: '50%',
          left: '80px',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClick}
      />
    );
  };

  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          background: 'transparent',
          borderRadius: '50%',
          right: '80px',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
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
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-8">
        {trips?.map((trip) => {
          const profilePicUrl = trip.user_profile.photo?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${trip.user_profile.photo?.url}`
            : '/default.webp';

          const steps = stepsData[trip.id] || [];
          const likes = likesData[trip.id] || [];
          console.log("likes:",likes[0]);
          const userId = likes
          console.log("userid",userId.length)

          

          return (
            <div key={trip.id} className="flex flex-col w-full max-w-lg">
              <div
                className="bg-white bg-opacity-90 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col w-full max-w-lg"
              >
                {trip.user_profile && (
                  <div className="flex mb-4">
                    <Link href={`/${trip.user_profile.user.id}`}>
                      <img
                        src={profilePicUrl}
                        alt="User Profile"
                        className="h-10 w-10 rounded-full object-cover mr-2"
                      />
                    </Link>
                    <Link href={`/${trip.user_profile.user.id}`}>
                      <h3 className="text-lg font-semibold">
                        {trip.user_profile.first_name} {trip.user_profile.last_name}
                      </h3>
                    </Link>
                  </div>
                )}
                <div className="flex flex-col items-center mb-4">
                  <h2 className="text-2xl font-semibold mb-4 text-center">{trip.title}</h2>
                  {trip.media && trip.media.length > 1 ? (
                    <Slider {...sliderSettings} className="w-full max-w-lg relative">
                      {trip?.media?.map((media) => (
                        <div key={media.id} className="mb-4">
                          {media.mime.startsWith('image/') ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                              alt={trip.title}
                              className="w-60 h-60 object-cover rounded-lg cursor-pointer mx-auto"
                              onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                            />
                          ) : (
                            <video
                              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                              className="w-60 h-60 object-cover rounded-lg cursor-pointer mx-auto"
                              controls
                              onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                            />
                          )}
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    trip?.media?.map((media) => (
                      <div key={media.id} className="mb-4">
                        {media.mime.startsWith('image/') ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                            alt={trip.title}
                            className="w-60 h-60 object-cover rounded-lg cursor-pointer"
                            onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                          />
                        ) : (
                          <video
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                            className="w-60 h-60 object-cover rounded-lg cursor-pointer"
                            controls
                            onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Arrival Date:</span> {trip.arrival}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Depart Date:</span> {trip.depart}
                </p>
                <div className="relative">
                  <p
                    id={`description-${trip.id}`}
                    className={`text-gray-600 mb-4 leading-relaxed break-words overflow-wrap ${expandedDescription[trip.id] ? '' : 'line-clamp-3'}`}
                  >
                    {trip.description}
                  </p>
                  {descriptionHeights[trip.id] > 72 && (
                    <button
                      onClick={() => toggleDescription(trip.id)}
                      className="absolute bottom-0 right-0 text-blue-500 hover:text-blue-700 transition-colors duration-300 bg-white"
                    >
                      {expandedDescription[trip.id] ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
                <div>
                  <button onClick={() => handleLike(trip.id)}>
                    
                    {userId.length}
                    ❤️ Likes
                  </button>
                  
                </div>
              </div>
               <div className='pt-9'>
                <StepCard trip={trip} steps={steps} />
              </div> 
            </div>
          );
        })}


        {selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white text-2xl font-bold"
              >
                &times;
              </button>
              {selectedMedia.endsWith('.mp4') ? (
                <video src={selectedMedia} controls className="max-w-full max-h-full"></video>
              ) : (
                <img src={selectedMedia} alt="Selected Media" className="max-w-full max-h-full" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
