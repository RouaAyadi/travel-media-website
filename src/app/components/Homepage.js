'use client';
import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Link from 'next/link';
import Navbar from './navbar2'; // Make sure the path is correct

const HomePage = ({ trips }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState({});
  const [descriptionHeights, setDescriptionHeights] = useState({});

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

  useEffect(() => {
    const heights = {};

    trips?.forEach((trip) => {
      const el = document.getElementById(`description-${trip.id}`);
      if (el) {
        heights[trip.id] = el.scrollHeight;
      }
    });
    setDescriptionHeights(heights);
  }, [trips]);

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
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Added for visibility
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Added for visibility
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
      <div
        style={{
          position: 'relative',
          top: '-20px',
        }}
      >
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative">
      <Navbar />
      <div className="absolute inset-0 overflow-hidden mt-20">
        {/* Background Illustrations */}
        <img
          src="/bg3.png"
          alt="Left Background"
          className="absolute"
          style={{ top: '20%', left: '5%', transform: 'rotate(-10deg)' }}
        />
        <img
          src="/bg4.png"
          alt="Right Background"
          className="absolute"
          style={{ top: '25%', right: '5%', transform: 'rotate(15deg)' }}
        />
        <img
          src="/bg5.png"
          alt="Left Background"
          className="absolute"
          style={{ top: '55%', left: '10%', transform: 'rotate(-5deg)' }}
        />
        <img
          src="/bg6.png"
          alt="Right Background"
          className="absolute"
          style={{ top: '60%', right: '10%', transform: 'rotate(5deg)' }}
        />
        <img
          src="/bg7.png"
          alt="Left Background"
          className="absolute"
          style={{ top: '80%', left: '15%', transform: 'rotate(-15deg)' }}
        />
        <img
          src="/bg7.png"
          alt="Right Background"
          className="absolute"
          style={{ top: '85%', right: '15%', transform: 'rotate(10deg)' }}
        />
      </div>
      <div className="container mx-auto px-4 mt-16 py-8 bg-white bg-opacity-75 rounded-lg shadow-md relative">
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-teal-500 to-purple-800">
            Welcome to TravelMedia
          </span>
          <img src="travel.gif" alt="Travel" className="h-12 w-auto" />
        </h1>
        <div className="flex flex-col items-center gap-8">
          {trips?.map((trip) => {
            const profilePicUrl = trip.user_profile.photo?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${trip.user_profile.photo?.url}`
              : '/default.webp';

            return (
              <div
                key={trip.id}
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
                    className={`text-gray-600 mb-4 leading-relaxed break-words overflow-wrap ${expandedDescription[trip.id] ? '' : 'line-clamp-3'
                      }`}
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for displaying selected media */}
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
  );
};

export default HomePage;
