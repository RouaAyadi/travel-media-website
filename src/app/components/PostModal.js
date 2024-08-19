'use client';

import React, { useState } from 'react';
import { createTrip, useTripContext } from '../../../store/Trip';
import dynamic from 'next/dynamic';
import StepModal from './StepModal';

// Dynamically import the MapComponent with no SSR
const MapModal = dynamic(() => import('./modalmap'), { ssr: false });

const PostModal = ({ isVisible, onClose, id }) => {
  if (!isVisible) return null;

  const [title, setTitle] = useState('');
  const [arrival, setArrival] = useState('');
  const [depart, setDepart] = useState('');
  const [description, setDescription] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [location, setLocation] = useState(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [stepModalVisible, setStepModalVisible] = useState(false);
  const { state, dispatch } = useTripContext();
  const [files, setFiles] = useState([]);
  const [steps, setSteps] = useState([]);
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setShowPlaceholder(false);
  };

  const handleFileUploadClick = () => {
    document.getElementById('file-upload').click();
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (location) {
      // Debugging: Log the trip data
      console.log({
        title,
        arrival,
        depart,
        description,
        files,
        id,
        steps,
        latitude: location.lat,
        longitude: location.lng,
        trips_steps: steps,
      });

      await createTrip(dispatch, {
        title,
        arrival,
        depart,
        description,
        files,
        id,
        steps,
        latitude: location.lat,
        longitude: location.lng,
        trips_steps: steps,
      });
    } else {
      alert('Please select a location on the map.');
    }
  } catch (error) {
    console.error('Failed to create post:', error);
  }
};

  const handleLocationSelect = (latlng) => {
    setLocation(latlng);
    setMapModalVisible(false);
  };

  const handleSaveStep = (stepData) => {
    setSteps([...steps, stepData]);
  };

  return (
    <>
      <div className='fixed inset-0 z-40 overflow-y-auto flex items-center justify-center p-8'>
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-md' onClick={onClose}></div>
        <div className='relative bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-auto p-8 border border-gray-300'>
          <button
            className='absolute top-4 right-4 text-black hover:text-black focus:outline-none'
            onClick={onClose}
          >
            X
          </button>
          <div className='p-4'>
            <h2 className='text-3xl font-medium leading-none text-center mb-4'>
              Post on TravelMedia
            </h2>
            <div className='w-16 h-1 bg-blue mb-8 mx-auto'></div>
            <form onSubmit={handleSubmit} className='flex'>
              <div className='w-2/3 pr-4'>
                <div className='mb-4'>
                  <label className='block text-gray-700 font-medium'>Title</label>
                  <input
                    type='text'
                    name="title"
                    className="border border-gray-300 p-2 w-full h-12 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    placeholder="Your Post Title"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                    required
                  />
                </div>
                <div className='flex gap-x-4 mb-4'>
                  <div className='flex flex-col w-1/2'>
                    <label className='text-gray-700 font-medium'>Arrival Date</label>
                    <input
                      type='date'
                      name="arrival"
                      className="border border-gray-300 p-2 w-full h-12 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      value={arrival}
                      onChange={(e) => { setArrival(e.target.value) }}
                      required
                    />
                  </div>
                  <div className='flex flex-col w-1/2'>
                    <label className='text-gray-700 font-medium'>Depart Date</label>
                    <input
                      type='date'
                      name="depart"
                      className="border border-gray-300 p-2 w-full h-12 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      value={depart}
                      onChange={(e) => { setDepart(e.target.value) }}
                      required
                    />
                  </div>
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700 font-medium'>Description</label>
                  <textarea
                    id="desc"
                    name="desc"
                    rows="6"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}
                    className="block w-full border-gray-300 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md"
                    placeholder="Write about your trip"
                    required
                  ></textarea>
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700 font-medium'>Location</label>
                  <button
                    type='button'
                    className="border border-gray-300 p-2 w-full h-12 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    onClick={() => setMapModalVisible(true)}
                  >
                    {location ? `Selected Location: ${location.lat}, ${location.lng}` : 'Select Location'}
                  </button>
                </div>
               
                <div className='flex flex-col items-center mb-4'>
                  <button
                    type='submit'
                    name='sign'
                    className="bg-gradient-to-r from-amber-300 to-slate-200 text-white rounded-md p-2 h-auto w-full sm:w-auto sm:px-10 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 transform hover:bg-amber-100 hover:scale-105 hover:shadow-lg"
                  >
                    Post the trip
                  </button>
                </div>
              </div>
              <div className='w-1/3 pl-4 border-l border-gray-300'>
                <div className='flex flex-col items-center mb-4'>
                  <label className='block text-gray-700 font-medium'>Upload Files</label>
                  <div
                    className="border-4 border-dashed border-gray-400 p-4 w-full h-32 flex items-center justify-center cursor-pointer rounded-lg"
                    onClick={handleFileUploadClick}
                  >
                    <input
                      type='file'
                      id='file-upload'
                      name="files"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {files.length === 0 ? (
                      <span className="text-gray-500">Click to upload files</span>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 w-full">
                        {files.map((file, index) => (
                          <div key={index} className="relative group">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Uploaded File"
                                className="w-full h-24 object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                              />
                            ) : (
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-full h-24 object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                                controls
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700 font-medium'>Steps</label>
                  <button
                    type='button'
                    className="border border-gray-300 p-2 w-full h-12 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    onClick={() => setStepModalVisible(true)}
                  >
                    Add Step
                  </button>
                  <ul className='mt-4'>
                    {steps.map((step, index) => (
                      <li key={index} className='text-gray-700'>
                        {index + 1}. {step.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {mapModalVisible && (
        <MapModal
          isVisible={mapModalVisible}
          onClose={() => setMapModalVisible(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}
      {stepModalVisible && (
        <StepModal
          isOpen={stepModalVisible}
          onClose={() => setStepModalVisible(false)}
          onSave={handleSaveStep}
        />
      )}
    </>
  );
};

export default PostModal;
