'use client';
import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Link from 'next/link';
import Navbar from './Navbar4'; // Make sure the path is correct
import Navbarr from './Navbar3'; // Make sure the path is correct
import PostModal from './PostModal';
import PostCard from './PostCard';
import axios from 'axios';


const HomePage = ({ tripss }) => {
  const [trips, setTrips] = useState(tripss);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSearch = (results) => {
    setTrips(results); // Update the trips state with the search results
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      console.log('User ID:', user.id); // Log userId to check if it's being set
      setIsAuthenticated(true);
    }
  }, []);

  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users`, {
      params: {
        populate: 'user_profile' // This populates the user_profile relation
      }
    });
    const users = response.data
    const limitedUsers = users.slice(1,5); // Limit to 3 users
    console.log("first",limitedUsers);
    return limitedUsers;
  };
  useEffect(() => {
    async function getUsers() {
      const usersData = await fetchUsers();
      setUsers(usersData);
    }
    getUsers();
  }, []);
   useEffect(() => {
    console.log("users", users);
  }, [users]); 
  

  return (
    <div className="min-h-screen flex flex-col items-center relative bg-gray-300 ">
      <div className="w-full fixed top-0 left-0 right-0 z-50  ">
        {isAuthenticated ? (
          <Navbar onSearch={handleSearch} />
        ) : (
          <Navbarr onSearch={handleSearch} />
        )}
      </div>      
      

      {/* Flex container to align Sidebar and PostCard side by side */}
      <div className="container mx-auto px-4 mt-16 py-8 bg-white bg-opacity-75 rounded-lg shadow-md relative flex gap-0">

        {/* Sidebar */}
        {/* Clinics Section */}
        <div className="bg-white p-5 rounded-lg shadow-md-gray mb-4 fixed w-[300px] ml-9 hidden lg:block">
          <h2 className="text-xl font-bold mb-4">Agencies</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
              <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
                <img src="/traveltodo.png" alt="Clinic Icon" className="h-full w-full object-cover"/>
              </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-base">TravelTodo</h3>
                  <p className="text-gray-600 text-sm">Travel Agency</p>
                </div>
              </div>
              <a href="https://www.traveltodo.com/" target="_blank" rel="noopener noreferrer" >
              <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">
                View
              </button>
              </a>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
              <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
                <img src="/rosa.jpg" alt="Clinic Icon" className="h-full w-full object-cover"/>
              </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-base">Rosa Travel</h3>
                  <p className="text-gray-600 text-sm">Travel Agency</p>
                </div>
              </div>
              <a href="https://rosatravel.tn/" target="_blank" rel="noopener noreferrer" >
              <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">
                View
              </button>
              </a>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
              <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
                <img src="/israa.png" alt="Clinic Icon" className="h-full w-full object-cover"/>
              </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-base">Israa Travel</h3>
                  <p className="text-gray-600 text-sm">Travel Agency</p>
                </div>
              </div>
              <a href="https://israatravel.com/" target="_blank" rel="noopener noreferrer" >
              <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">
                View
              </button>
              </a>

            </div>
          </div>

          {/* people Section */}
          <div className="bg-white p-5 rounded-lg shadow-md-gray fixed top-[400px] w-[300px] ml-9 hidden lg:block">
            <h2 className="text-xl font-bold mb-4">People you may know</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
              <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
                <img src={ users[0]?.user_profile.photo || '/default.webp'}
                
                 alt="Clinic Icon" className="h-full w-full object-cover"/>
              </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-base">{users[0]?.user_profile.first_name} {users[0]?.user_profile.last_name}</h3>
      
                  <p className="text-gray-600 text-sm">{users[0]?.user_profile.Bio}</p>
                </div>
              </div>
              <Link href={`/${users[0]?.id}`}>
                <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">
                View 
                </button>
              </Link>

            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
              <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
                <img src={ users[1]?.user_profile.photo|| '/default.webp'}
                 alt="Clinic Icon" className="h-full w-full object-cover"/>
              </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-base">{users[1]?.user_profile.first_name} {users[1]?.user_profile.last_name}</h3>
                  <p className="text-gray-600 text-sm">{users[1]?.user_profile.Bio}</p>
                </div>
              </div>
              <Link href={`/${users[1]?.id}`}>
                <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">
                View 
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
              <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
                <img src={ users[2]?.user_profile.photo|| '/default.webp'}
                 alt="Clinic Icon" className="h-full w-full object-cover"/>
              </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-base">{users[2]?.user_profile.first_name} {users[2]?.user_profile.last_name}</h3>
                  <p className="text-gray-600 text-sm">{users[2]?.user_profile.Bio}</p>
                </div>
              </div>
              <Link href={`/${users[2]?.id}`}>
                <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">
                View 
                </button>
              </Link>
            </div>
          </div>

        {/* PostCard Component */}
        <div className="flex-1 "> {/* Makes the div fill the full viewport height */}
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-teal-500 to-purple-800">
              Welcome to TravelMedia
            </span>
            <img src="travel.gif" alt="Travel" className="h-12 w-auto" />
          </h1>
          <PostCard trips={trips}/>
        </div>
        {/* Image on the right */}
        
          <img src="/travel2.avif" alt="Travel" className="rounded-lg shadow-md-gray fixed w-[300px]  h-[260px] right-20 hidden lg:block" />
        


          <img src="/travel3.jpg" alt="Travel" className="rounded-lg shadow-md-gray fixed top-[400px] w-[300px]  h-[260px] right-20 hidden lg:block" />
        
        </div>

      
    </div>
  );
};

export default HomePage;