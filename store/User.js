import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const initialState = {
  user: null,
  jwt: null,
  isAuth:false,

};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user, jwt: action.payload.jwt,isAuth:true };
    case 'SET_IMAGE':
      return { ...state, image: action.payload.image };
    default:
      return state;
  }
};

const setUser = (user, jwt) => ({
  type: 'SET_USER',
  payload: { user, jwt },
});

const setImage = (image) => ({
  type: 'SET_IMAGE',
  payload: { image },
});

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

export const createUser = async (dispatch, { email, password, lastname, firstname, phonenumber, bio }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
      {
        username: Date.now().toString(),
        email,
        password,
      },
    );
    if (response?.data?.user?.id) {
      const { user, jwt } = response.data;
      dispatch(setUser(user, jwt));
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('jwt', jwt);

      const userDetailsResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/user-profiles`,
        {
          data: {
            first_name: firstname,
            last_name: lastname,
            phone_number: phonenumber,
            Bio: bio,
            user: response.data.user.id,
          },
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      if (userDetailsResponse.data) {
        alert('User successfully created and details added.');
        return userDetailsResponse.data;
      } else {
        alert('Failed to add user details.');
        return 'KO';
      }
    } else {
      alert('Failed to register user.');
      return 'KO';
    }
  } catch (error) {
    console.error('Failed to add user:', error);
    alert('Failed to add user.');
    return 'KO';
  }
};

export const uploadProfilePic = async (dispatch, { file, id }) => {
  const jwt = localStorage.getItem('jwt');
  if (file) {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/`,
        formData,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      if (uploadResponse?.data?.length) {
        const photoId = uploadResponse.data[0].id;
        const image = uploadResponse.data[0].url;
        dispatch(setImage(image));

        await axios.put(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/user-profiles/${id}`,
          { data: { photo: photoId } },
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
};
export const fetchMe = async (dispatch) => {
  const jwt = localStorage.getItem('jwt');
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if(response.data){
      const user = response.data
      dispatch(setUser(user, jwt));
    
    }
      return response.data;
  } catch (error) {
    console.error('Failed to fetch me:', error);
    return null;
  }
};
export const LoginUser = async (dispatch, { email, password }) => {
  try {
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
      {
       identifier:email,
        password,
      },
    );
    if (resp?.data?.user?.id) {
      const {user,jwt} = resp.data
      console.log(resp)
      dispatch(setUser(user,jwt));

      localStorage.setItem('user',JSON.stringify(user));
      localStorage.setItem('jwt',jwt);

      if (resp.data) {
        alert('User successfully logged in');
        return resp.data;
      } else {
        alert('Failed to log in');
        return 'KO';
      }

    }
  } catch (error) {
    console.error('Failed to log in:', error);
    alert('Failed to log in.');
    return 'KO';
  }
};
export const LogoutUser=(dispatch)=>{
  localStorage.removeItem('user');
  localStorage.removeItem('jwt');
  dispatch(setUser(null,null));
};
export const forgotPass = async (dispatch,{email}) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/forgot-password`, {
      email,
    });

    if (res.status == 200) {
      alert('Check your email for the reset link.');
      return res.status
    }
  } catch (error) {
    alert('Something went wrong. Please try again.'); 
  }
};
const ResetPAss = async (dispatch,{code,password,passwordConfirmation}) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}api/auth/reset-password`, {
      code,
      password,
      passwordConfirmation,
    });

    if (res.status === 200) {
      alert('Password has been reset successfully.');
      return res.status
    }
  } catch (error) {
    alert('Something went wrong. Please try again.');
  }
};
