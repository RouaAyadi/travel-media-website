'use client'
import React from 'react'
import Link from 'next/link'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useState, useEffect } from 'react'



const StepCard = ({trip,steps}) => {
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

    steps?.forEach((step) => {
      const el = document.getElementById(`description-${step.id}`);
      if (el) {
        heights[step.id] = el.scrollHeight;
      }
    });
    setDescriptionHeights(heights);
  }, [steps]);

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
    <div className="flex flex-col items-center gap-8">
          {steps?.map((step) => {
            const profilePicUrl = trip.user_profile.photo?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${trip.user_profile.photo?.url}`
              : '/default.webp';

            return (
              <div
                key={step.id}
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
                <div className="bg-gray-100 p-2 rounded-md mb-4 text-center w-full">
                    <h2 className="text-xl font-semibold"> A step of the trip : {trip.title}</h2>
                </div>
                <div className="flex flex-col items-center mb-4">
                  <h2 className="text-2xl font-semibold mb-4 text-center">{step.name}</h2>
                  {step.media && step.media.length > 1 ? (
                    <Slider {...sliderSettings} className="w-full max-w-lg relative">
                      {step?.media?.map((media) => (
                        <div key={media.id} className="mb-4">
                          {media.mime.startsWith('image/') ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                              alt={step.name}
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
                    step?.media?.map((media) => (
                      <div key={media.id} className="mb-4">
                        {media.mime.startsWith('image/') ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${media.url}`}
                            alt={step.name}
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
                  <span className="font-bold">Arrival Date:</span> {step.arrival}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Depart Date:</span> {step.depart}
                </p>
                <div className="relative">
                  <p
                    id={`description-${step.id}`}
                    className={`text-gray-600 mb-4 leading-relaxed break-words overflow-wrap ${expandedDescription[step.id] ? '' : 'line-clamp-3'
                      }`}
                  >
                    {step.description}
                  </p>
                  {descriptionHeights[step.id] > 72 && (
                    <button
                      onClick={() => toggleDescription(step.id)}
                      className="absolute bottom-0 right-0 text-blue-500 hover:text-blue-700 transition-colors duration-300 bg-white"
                    >
                      {expandedDescription[step.id] ? 'Show Less' : 'Show More'}
                    </button>
                  )}
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
  )
}

export default StepCard