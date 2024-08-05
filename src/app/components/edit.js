// components/EditPostModal.js
import React from 'react';

const EditPostModal = ({ isVisible, onClose, postData, onSave, onChange }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <button
          className="absolute top-0 right-0 m-4 text-gray-600 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
        <input
          type="text"
          name="title"
          value={postData.title}
          onChange={onChange}
          className="block w-full mb-2 p-2 border rounded-md"
          placeholder="Title"
        />
        <textarea
          name="description"
          value={postData.description}
          onChange={onChange}
          className="block w-full mb-2 p-2 border rounded-md"
          placeholder="Description"
          rows="4"
        />
        <input
          type="text"
          name="latitude"
          value={postData.latitude}
          onChange={onChange}
          className="block w-full mb-2 p-2 border rounded-md"
          placeholder="Latitude"
        />
        <input
          type="text"
          name="longitude"
          value={postData.longitude}
          onChange={onChange}
          className="block w-full mb-2 p-2 border rounded-md"
          placeholder="Longitude"
        />
        <button
          type="button"
          onClick={onSave}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md focus:outline-none"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditPostModal;
