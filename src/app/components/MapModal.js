'use client'
import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure this import is correct

// Fix for default marker icons not appearing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapModalWithCoords = ({ isVisible, onClose, latitude, longitude }) => {
  const MapUpdater = () => {
    const map = useMap();
    React.useEffect(() => {
      if (latitude && longitude) {
        map.setView([latitude, longitude], 13); // Set the view to the provided coordinates
      }
    }, [latitude, longitude, map]);

    return <Marker position={[latitude, longitude]} />;
  };

  if (!isVisible) return null;

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
            This is the location
          </h2>
          <div className='w-16 h-1 bg-blue mb-8 mx-auto'></div>
          <div className='h-96 w-full'>
            <MapContainer
              center={[latitude || 51.505, longitude || -0.09]} // Default to center if no coordinates
              zoom={13}
              scrollWheelZoom={false}
              className='h-full w-full'
            >
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <MapUpdater />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModalWithCoords;
