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


  return (
    <div className="min-h-screen flex flex-col items-center relative">
    <div className="w-full fixed top-0 left-0 right-0 z-50">
        {isAuthenticated ? (
          <Navbar onSearch={handleSearch} />
        ) : (
          <Navbarr onSearch={handleSearch} />
        )}
      </div>      
      <div className='py-12'></div>
      <div className="absolute inset-0 overflow-hidden mt-20">
        {/* Background Illustrations */}
        <img
          src="/bg3.png"
          alt="Left Background"
          className="absolute"
          style={{ top: '20%', left: '5%', transform: 'rotate(-10deg)' }}
        />
        <img
          src="/bg4.png"
          alt="Right Background"
          className="absolute"
          style={{ top: '25%', right: '5%', transform: 'rotate(15deg)' }}
        />
        <img
          src="/bg5.png"
          alt="Left Background"
          className="absolute"
          style={{ top: '55%', left: '10%', transform: 'rotate(-5deg)' }}
        />
        <img
          src="/bg6.png"
          alt="Right Background"
          className="absolute"
          style={{ top: '60%', right: '10%', transform: 'rotate(5deg)' }}
        />
        <img
          src="/bg7.png"
          alt="Left Background"
          className="absolute"
          style={{ top: '80%', left: '15%', transform: 'rotate(-15deg)' }}
        />
        <img
          src="/bg7.png"
          alt="Right Background"
          className="absolute"
          style={{ top: '85%', right: '15%', transform: 'rotate(10deg)' }}
        />
      </div>
      <div className="container mx-auto px-4 mt-16 py-8 bg-white bg-opacity-75 rounded-lg shadow-md relative">
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-teal-500 to-purple-800">
            Welcome to TravelMedia
          </span>
          <img src="travel.gif" alt="Travel" className="h-12 w-auto" />
        </h1>
        <PostCard trips={trips}/>
      </div>
      
    </div>
  );
};

export default HomePage;
