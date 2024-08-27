  import axios from "axios";
  import { twMerge } from "tailwind-merge"

  export const fetchUserProfileById = async (id) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/user-profiles?populate=*&filters[user][id][$eq]=${id}`,);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
      }
    };
    
    export const fetchAllPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips`, {
          params: {
            populate: {
              user_profile: {
                populate: {
                  photo: true,
                  user: true,
                },
              },
              media: true,
              trip_steps: true, // Populate trip_steps if needed
            },
          },
        });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch trips:', error);
        return null;
      }
    };
    export const fetchPostsNById = async (id) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips?populate=*&filters[user_profile][id][$eq]=${id}`);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        return null;
      }
    };


    
  export function cn(...inputs) {
    return twMerge(clsx(inputs))
  }
  // Function to fetch posts by title
  export const fetchPostsByTitle = async (title) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips`, {
        params: {
          filters: {
            title: {
              $containsi: title, // Case-insensitive partial match
            },
          },
          populate: {
            user_profile: {
              populate: {
                photo: true,
                user: true,
              },
            },
            media: true,
            trip_steps: true, // Populate trip_steps if needed
          },
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts by title:', error);
      return null;
    }
  };

  export const fetchAllTripSteps = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips`, {
        params: {
          populate: {
            trip_steps: true, // Populate trip_steps for all trips
          },
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trip steps:', error);
      return null;
    }
  };



  export const fetchTripStepsByTripId = async (tripId) => {
    try {
      // Fetch the trip data including trip_steps
      const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips?populate[media]=*&populate[trip_steps][populate][media]=*`, {
        params: {
          filters: {
            id: {
              $eq: tripId,
            },
          },
          populate: {
            trip_steps: true,
          },
        },
      });
  
      // Extract trip_steps from the response
      const trips = response.data?.data ?? [];
      const trip = trips.find(t => t.id === tripId);
      return Array.isArray(trip?.trip_steps) ? trip.trip_steps : [];
    } catch (error) {
      console.error('Failed to fetch trip steps by trip ID:', error);
      return [];
    }
  };
  



export const fetchLikesByTripId = async (tripId) => {
  try {
    // Make a GET request to fetch the trip data including likes
    const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips/${tripId}?populate[likes]=*`);

    // Extract the likes from the response data
    const likes = response.data.data.likes || [];

    return likes;
  } catch (error) {
    console.error(`Error fetching likes for trip ${tripId}:`, error);

    // Return an empty array on error
    return [];
  }
};
