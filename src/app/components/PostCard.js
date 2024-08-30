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
  const [likesData, setLikesData] = useState({}); // Store likes per trip

  // useEffect(() => {
  //   const fetchCurrentUser = async () => {
  //     try {
  //       const user = await fetchMe2();
  //       setCurrentUser(user);
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   };

  //   fetchCurrentUser();
  // }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);

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

  useEffect(() => {
    const fetchLikesForTrips = async () => {
      const likesForTrips = {};
      for (const trip of trips) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips/${trip.id}?populate=likes`);
          const likesCount = response.data.data.likes.length;
          likesForTrips[trip.id] = likesCount;
        } catch (error) {
          console.error(`Error fetching likes for trip ${trip.id}:`, error);
        }
      }
      setLikesData(likesForTrips);
    };

    fetchLikesForTrips();
  }, [trips]);


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
          const likesCount = likesData[trip.id] || 0;
          const [numberLike, setNumberLike] = useState(false);
          useEffect(() => {
            const getMyLikes = async () => {
              try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/likes`, {
                  params: {
                    'filters[trip][id][$eq]': trip.id,
                    'filters[user][id][$eq]': currentUser.id
                  }
                });
                // const likeId = response.data[0].id;
                response.data.data.length === 1 ? setNumberLike(true) : setNumberLike(false);
              } catch (error) {
                console.error(`Error fetching likes for trip ${trip.id}:`, error);
                setNumberLike(false);
              }
            };

            getMyLikes();
          }, [trip,currentUser]);

          const handleLike = async (tripId) => {
            if (!currentUser) {
              console.error("User not authenticated.");
              return;
            }
            try {
              if (numberLike === true) {
                const { data: likes } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/likes`, {
                  params: {
                    'filters[trip][id][$eq]': tripId,
                    'filters[user][id][$eq]': currentUser.id
                  }
                });
                const likeId = likes.data[0]?.id;
                await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/likes/${likeId}`);
                console.log("Like removed");
                setNumberLike(false);

                const likesForTrips = { ...likesData };
                if (likesForTrips[tripId]) {
                  likesForTrips[tripId] -= 1;
                  setLikesData(likesForTrips);
                }

              } else {
                console.log(tripId)
                await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/likes`, {
                  data: { trip: tripId, user: currentUser.id }
                });
                console.log("Like added");
                setNumberLike(true);

                const likesForTrips = { ...likesData };
                if (likesForTrips[tripId]) {
                  likesForTrips[tripId] += 1;
                } else {
                  likesForTrips[tripId] = 1;
                }
                setLikesData(likesForTrips);
              }
            } catch (error) {
              console.error("Error updating like status:", error);
            }
          };

          return (
            <div key={trip.id} className="flex flex-col w-full max-w-lg">
              <div
                className="bg-white bg-opacity-90 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col w-full max-w-lg"
              >
                {trip.user_profile && (
                  <div className="flex mb-4 relative">
                    <Link href={`/${trip.user_profile.user.id}`} className="flex items-center space-x-4">
                      <img
                        src={profilePicUrl}
                        alt="User Profile"
                        className="h-12 w-12 rounded-full object-cover shadow-md"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {trip.user_profile.first_name} {trip.user_profile.last_name}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {new Date(trip.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
                <div className="flex flex-col items-center mb-4">
                  <h2 className="text-2xl font-semibold mb-4 text-center">{trip.title}</h2>
                  {trip.media && trip.media.length > 1 ? (
                    <Slider {...sliderSettings} className="w-full max-w-lg relative">
                      {trip.media.map((media) => (
                        <div key={media.id} className="mb-4">
                          {media.mime.startsWith('image/') ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                              alt={trip.title}
                              className="w-96 h-96 object-cover rounded-lg cursor-pointer mx-auto"
                              onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                            />
                          ) : (
                            <video
                              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                              className="w-96 h-960 object-cover rounded-lg cursor-pointer mx-auto"
                              controls
                              onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                            />
                          )}
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    trip.media.map((media) => (
                      <div key={media.id} className="mb-4">
                        {media.mime.startsWith('image/') ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                            alt={trip.title}
                            className="w-96 h-96 object-cover rounded-lg cursor-pointer"
                            onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                          />
                        ) : (
                          <video
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                            className="w-96 h-96 object-cover rounded-lg cursor-pointer"
                            controls
                            onClick={() => handleMediaClick(`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`)}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="text-center my-2">
                  <p className="text-gray-600 font-medium text-lg">
                    <span className="font-bold">From</span>
                    <span className="mx-2">
                      {new Date(trip.depart).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="font-bold mx-2">to</span>
                    <span>
                      {new Date(trip.arrival).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </p>
                </div>

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
                  <button onClick={() => handleLike(trip.id)} >

                    <span class="flex h-min w-min space-x-1 items-center rounded-full  hover:text-rose-600  hover:bg-rose-50 py-1 px-2 text-xs font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>

                    </span>
                    <p class="font-semibold text-xs">{likesCount} Likes</p>

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

