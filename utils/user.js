import axios from "axios";
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
 