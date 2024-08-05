'use client'
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure this import is correct

// Fix for default marker icons not appearing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapModal = ({ isVisible, onClose, onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      }
    });

    return position ? <Marker position={position} /> : null;
  };

  if (!isVisible) return null;

  const handleAddLocation = () => {
    if (position) {
      onLocationSelect(position);
      onClose(); // Close the modal after selection
    }
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-8'>
      <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-md' onClick={onClose}></div>
      <div className='relative bg-white rounded-lg shadow-2xl max-w-7xl w-full mx-auto p-8 border border-gray-300'>
        <button
          className='absolute top-4 right-4 text-black hover:text-black focus:outline-none'
          onClick={onClose}
        >
          X
        </button>
        <div className='p-4'>
          <h2 className='text-3xl font-medium leading-none text-center mb-4'>
            Select Location
          </h2>
          <div className='w-16 h-1 bg-blue mb-8 mx-auto'></div>
          <div className='h-96 w-full'>
            <MapContainer
              center={[51.505, -0.09]} // Default center point
              zoom={13}
              scrollWheelZoom={false}
              className='h-full w-full'
            >
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <LocationMarker />
            </MapContainer>
          </div>
          <button
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none'
            onClick={handleAddLocation}
            disabled={!position} // Disable button if no location is selected
          >
            Add Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
