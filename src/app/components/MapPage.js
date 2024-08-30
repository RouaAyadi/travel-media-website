'use client';
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const MapPage = ({ isVisible, onClose, trip }) => {
  const [tripSteps, setTripSteps] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (trip && trip.trip_steps) {
      setTripSteps(trip.trip_steps);
    }
  }, [trip]);

  useEffect(() => {
    if (trip && mapRef.current) {
      const map = mapRef.current;
      const lat = parseFloat(trip.latitude);
      const lng = parseFloat(trip.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 9, { duration: 1.5 }); // Center map on the trip location
      }
    }
  }, [trip]);

  const handleStepClick = (step) => {
    const lat = parseFloat(step.latitude);
    const lng = parseFloat(step.longitude);

    if (!isNaN(lat) && !isNaN(lng) && mapRef.current) {
      const map = mapRef.current;
      map.flyTo([lat, lng], 11, { duration: 1.5 }); // Smooth transition with a zoom level of 11
    }
  };

  if (!trip) return null;

  const { latitude, longitude, title, description, arrival, depart, media } = trip;
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      contentLabel="Trip Details"
      className="absolute top-0 left-0 right-0 bottom-0 bg-white p-0 flex"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <button onClick={onClose} className='absolute top-2 right-2 text-2xl font-bold z-20'>&times;</button>
      <div className='flex flex-1'>
        {/* Map Container */}
        <div className='w-2/3 h-full'>
          <MapContainer
            center={[lat, lng]}
            zoom={9}
            scrollWheelZoom={false}
            className='h-full w-full'
            ref={mapRef}
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker
              position={[lat, lng]}
            />
            {tripSteps && tripSteps.map(step => {
              const stepLat = parseFloat(step.latitude);
              const stepLng = parseFloat(step.longitude);

              if (!isNaN(stepLat) && !isNaN(stepLng)) {
                return (
                  <Marker
                    key={step.id}
                    position={[stepLat, stepLng]}
                    eventHandlers={{
                      click: () => handleStepClick(step),
                    }}
                  />
                );
              } else {
                console.error(`Invalid coordinates for step ${step.id}: lat=${step.latitude}, lng=${step.longitude}`);
                return null;
              }
            })}
          </MapContainer>
        </div>

        {/* Details Container */}
        <div className='w-1/3 h-full p-6 overflow-auto'>
          <h2 className='text-2xl font-bold mb-4'>{title}</h2>
          <p className='mb-4 leading-relaxed break-words overflow-wrap'>{description}</p>
          <p className='mb-2 text-gray-600'>
            <span className='font-bold'>Arrival Date:</span> {arrival}
          </p>
          <p className='mb-2 text-gray-600'>
            <span className='font-bold'>Depart Date:</span> {depart}
          </p>
          {media && media.length > 0 && (
            media.map((mediaItem) => {
              const mediaUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${mediaItem.url}`;
              return mediaItem.mime.startsWith('image/') ? (
                <img
                  key={mediaItem.id}
                  src={mediaUrl}
                  alt={mediaItem.name || title}
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
    </Modal>
  );
};

export default MapPage;
