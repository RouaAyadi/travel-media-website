'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Modal from 'react-modal';

// Fix for default marker icons not appearing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Set the app element for accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement(document.body); // Use document.body as the app element
}

const MapPage = () => {
  const [posts, setPosts] = useState([]); // Initialize as empty array
  const [selectedPost, setSelectedPost] = useState(null);
  const [tripSteps, setTripSteps] = useState([]);
  const [savedView, setSavedView] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips`, {
          params: {
            populate: {
              media: true,
              trip_steps: {
                populate: 'media',
              },
            },
          },
        });
        const postData = response?.data?.data; // Access the 'data' property
        if (Array.isArray(postData)) { // Check if data is an array
          setPosts(postData);
        } else {
          console.error('Data format error: Expected an array of posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleMarkerClick = (post) => {
    setTripSteps(post.trip_steps);

    if (mapRef.current) {
      const map = mapRef.current;
      const currentView = map.getCenter();
      const currentZoom = map.getZoom();
      setSavedView({ lat: currentView.lat, lng: currentView.lng, zoom: currentZoom });

      const lat = parseFloat(post.latitude);
      const lng = parseFloat(post.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 9, { duration: 1.5 }); // Smooth transition with a zoom level of 9
        setSelectedPost(post);
      }
    }
  };

  const handleStepClick = (step) => {
    const lat = parseFloat(step.latitude);
    const lng = parseFloat(step.longitude);

    if (!isNaN(lat) && !isNaN(lng) && mapRef.current) {
      const map = mapRef.current;
      map.flyTo([lat, lng], 11, { duration: 1.5 }); // Smooth transition with a zoom level of 11 and duration of 1.5 seconds
    }
  };

  const handleCloseModal = () => {
    if (savedView && mapRef.current) {
      const map = mapRef.current;
      map.flyTo([savedView.lat, savedView.lng], savedView.zoom, { duration: 1.5 }); // Restore the saved view with a smooth transition
    }
    setSelectedPost(null);
    setTripSteps([]);
  };

  return (
    <div className='h-screen relative'>
      <MapContainer
        center={[51.505, -0.09]} // Default center point
        zoom={3}
        scrollWheelZoom={false}
        className='h-full w-full z-0' // Ensure the map has a lower z-index
        ref={mapRef}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {posts?.map(post => {
          // Check if latitude and longitude are valid numbers
          const lat = parseFloat(post.latitude);
          const lng = parseFloat(post.longitude);

          if (!isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null) {
            return (
              <Marker
                key={post.id}
                position={[lat, lng]}
                eventHandlers={{
                  click: () => handleMarkerClick(post),
                }}
              />
            );
          } else {
            console.error(`Invalid coordinates for post ${post.id}: lat=${post.latitude}, lng=${post.longitude}`);
            return null; // Skip rendering the marker for invalid coordinates
          }
        })}

        {selectedPost && tripSteps && tripSteps.map(step => {
          // Check if latitude and longitude are valid numbers
          const lat = parseFloat(step.latitude);
          const lng = parseFloat(step.longitude);

          if (!isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null) {
            return (
              <Marker
                key={step.id}
                position={[lat, lng]}
              />
            );
          } else {
            console.error(`Invalid coordinates for step ${step.id}: lat=${step.latitude}, lng=${step.longitude}`);
            return null; // Skip rendering the marker for invalid coordinates
          }
        })}
      </MapContainer>

      {selectedPost && (
        <div className='absolute top-0 right-0 w-1/3 h-full bg-white overflow-y-auto shadow-lg z-10'>
          <div className='relative p-6'>
            <button onClick={handleCloseModal} className='absolute top-2 right-2 text-2xl font-bold'>&times;</button>
            <h2 className='text-2xl font-bold mb-4'>{selectedPost.title}</h2>
            <p className='mb-4 leading-relaxed break-words overflow-wrap'>{selectedPost.description}</p>
            <p className='mb-2 text-gray-600'>
              <span className='font-bold'>Arrival Date:</span> {selectedPost.arrival}
            </p>
            <p className='mb-2 text-gray-600'>
              <span className='font-bold'>Depart Date:</span> {selectedPost.depart}
            </p>
            {selectedPost.media && selectedPost.media.length > 0 && (
              selectedPost.media.map((mediaItem) => {
                const mediaUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${mediaItem.url}`;
                return mediaItem.mime.startsWith('image/') ? (
                  <img
                    key={mediaItem.id}
                    src={mediaUrl}
                    alt={mediaItem.name || selectedPost.title}
                    className='w-full h-auto mt-2'
                  />
                ) : mediaItem.mime.startsWith('video/') ? (
                  <video
                    key={mediaItem.id}
                    src={mediaUrl}
                    controls={false}
                    className='w-full h-auto mt-2'
                  >
                    <track kind="captions" />
                  </video>
                ) : null;
              })
            )}
            <h3 className='text-xl font-bold mt-4'>Steps</h3>
            {tripSteps && tripSteps.length > 0 ? (
              tripSteps.map(step => (
                <div key={step.id} className='mb-4'>
                  <h4 className='font-bold cursor-pointer' onClick={() => handleStepClick(step)}>{step.name}</h4>
                  <p className='mb-2 text-gray-600'>
                    <span className='font-bold'>Arrival Date:</span> {step.arrival}
                  </p>
                  <p className='mb-2 text-gray-600'>
                    <span className='font-bold'>Depart Date:</span> {step.depart}
                  </p>
                  <p className='leading-relaxed break-words overflow-wrap'>{step.description}</p>
                  {step.media && step.media.length > 0 && (
                    step.media.map((mediaItem) => {
                      const mediaUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${mediaItem.url}`;
                      return mediaItem.mime.startsWith('image/') ? (
                        <img
                          key={mediaItem.id}
                          src={mediaUrl}
                          alt={mediaItem.name || step.title}
                          className='w-full h-auto mt-2'
                        />
                      ) : mediaItem.mime.startsWith('video/') ? (
                        <video
                          key={mediaItem.id}
                          src={mediaUrl}
                          controls={false}
                          className='w-full h-auto mt-2'
                        >
                          <track kind="captions" />
                        </video>
                      ) : null;
                    })
                  )}
                </div>
              ))
            ) : (
              <p>No steps available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
