import React from 'react';
import { Dialog } from '@headlessui/react';

const EditModal = ({ isVisible, onClose, newPostData, onSave, onInputChange, onLocationSelect,handleFileChange }) => {
  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            X
          </button>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={newPostData.title}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={newPostData.description}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="4"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Latitude</label>
          <input
            type="text"
            name="latitude"
            value={newPostData.latitude}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Longitude</label>
          <input
            type="text"
            name="longitude"
            value={newPostData.longitude}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Media</label>
          <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={(e) => handleFileChange(e)} 
                className="block w-full mb-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => {
              onLocationSelect({
                lat: newPostData.latitude,
                lng: newPostData.longitude,
              });
              onClose();
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Select Location
          </button>
          <button
            onClick={onSave}
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditModal;
