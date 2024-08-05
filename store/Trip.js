'use client';

import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

const TripContext = createContext();

const initialState = {
  trip: null,
  jwt: null,
};

const tripReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRIP':
      return { ...state, trip: action.payload };
    default:
      return state;
  }
};

const setTrip = (trip) => ({
  type: 'SET_TRIP',
  payload: trip,
});

export const TripProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  return (
    <TripContext.Provider value={{ state, dispatch }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => useContext(TripContext);

export const createTrip = async (dispatch, { title, arrival, depart, description, files, id, trips_steps,latitude,longitude }) => {
  const jwt = localStorage.getItem('jwt');

  try {
    let media = [];
    // Upload files if provided
    if (files && files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (uploadResponse.data.length) {
        media = uploadResponse.data.map((el) => el.id);
      }
    }

    const steps = await Promise.all(trips_steps.map(async (step) => {
      if (step.media) {
        const formData = new FormData();
        step.media.forEach((file) => {
          formData.append('files', file);
        });
        const imageUploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/`
          , formData, { headers: { Authorization: 'Bearer ' + jwt } });
        if (imageUploadResponse?.data?.length) {
          step.media = imageUploadResponse.data[0].id;
        }
      } return step;
    }));
    const tripResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips`,
      {
        data: {
          title,
          arrival,
          depart,
          description,
          user_profile: id,
          media,
          latitude,
          longitude,
          trip_steps: steps
        },
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (tripResponse.data) {
      alert('Trip successfully created and details added.');
      dispatch(setTrip(tripResponse.data)); // Update context with new trip data
      return tripResponse.data;
    } else {
      alert('Failed to add trip details.');
      return 'KO';
    }
  } catch (error) {
    console.error('Failed to create trip:', error);
    throw error;
  }
};

export const uploadMedia = async (_dispatch, { file, id }) => {
  const jwt = localStorage.getItem('jwt');
  if (file) {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/`,
        formData,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );

      if (uploadResponse?.data?.length) {
        const MediaId = uploadResponse.data[0].id;

        await axios.put(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips/${id}`,
          { data: { media: MediaId } },
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        console.log(uploadResponse);
      }
    } catch (error) {
      console.error('Failed to upload media:', error);
      throw error;
    }
  }
};

export const deleteTrip = async (id) => {
  const jwt = localStorage.getItem('jwt');

  try {
    const deleteResponse = await axios.delete(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips/${id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (deleteResponse.status === 200) {
      alert('Trip successfully deleted.');
      return deleteResponse.data;
    } else {
      alert('Failed to delete trip.');
      return 'KO';
    }
  } catch (error) {
    console.error('Failed to delete trip:', error);
    throw error;
  }
};

export const editTrip = async (id, updatedData) => {
  const jwt = localStorage.getItem('jwt');

  try {
    const editResponse = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips/${id}`,
      {
        data: updatedData,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (editResponse.data) {
      alert('Trip successfully updated.');
      return editResponse.data;
    } else {
      alert('Failed to update trip.');
      return 'KO';
    }
  } catch (error) {
    console.error('Failed to edit trip:', error);
    throw error;
  }
};
