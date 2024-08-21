"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = ({ onSearch }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setIsAuthenticated(true);
      setUserId(user.id);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips`, {
        params: {
          filters: {
            title: {
              $containsi: searchQuery, // Correct Strapi query for filtering titles
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
      const trips = response.data.data; // Ensure `data` contains the array of trips
      if (Array.isArray(trips)) {
        onSearch(trips);
      } else {
        console.error('Unexpected response structure:', response.data);
        onSearch([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      onSearch([]);
    }
  };

  useEffect(() => {
    handleSearch(new Event('change')); // Trigger search on component mount
  }, [searchQuery]);

  const profileLink = isAuthenticated ? `/${userId}` : '/log';

  return (
    <>
      <div id='Nav'>
        <div className='fixed top-0 left-0 right-0 bg-transparent rounded-b opacity-95'>
          <div className="relative flex h-16 items-center justify-between px-4 md:px-8">
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:text-gray-200 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={showMenu}
              >
                {showMenu ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
            <div className="relative flex h-20 items-center justify-between px-8 md:px-16">
              <div className="flex items-center space-x-2">
                <Link href='/'>
                  <div className="flex items-center">
                    <img className="h-12 w-auto max-w-xs" src="logo.png" alt="Logo" />
                    <p className='text-xl font-bold font-sans-serif leading-none text-center bg-clip-text text-transparent bg-gradient-to-b from-green-400 via-teal-700 to-purple-800 uppercase pt-4'>
                      TravelMedia
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className='hidden md:flex items-center justify-center flex-grow'>
              <div className='flex text-black gap-6'>
                <input
                  type="text"
                  className="rounded-md border px-3 py-2 text-sm"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="button" className="ml-2 text-sm text-white bg-purple-800 px-4 py-2 rounded-md">
                  Search
                </button>
              </div>
            </div>
           
            <div className='flex text-white gap-20 pr-2'>
              <Link href='/Map' className='flex items-center gap-1 hover:text-gray-300 duration-500'>
                <img src="location-pin.png" alt="Map" className="h-8 w-8" />
                <span className='mt-2 bg-clip-text text-transparent bg-gradient-to-b from-green-400 via-teal-700 to-purple-800 hover:underline decoration-2 decoration-transparent hover:decoration-purple-800 transition-all duration-300'>
                  Map
                </span>
              </Link>
              <Link href={profileLink} className='flex items-center gap-1 hover:text-gray-300 duration-500'>
                <img src="profile.png" alt="Profile" className="h-8 w-8" />
                <span className='mt-2 bg-clip-text text-transparent bg-gradient-to-b from-green-400 via-teal-700 to-purple-800 hover:underline decoration-2 decoration-transparent hover:decoration-purple-800 transition-all duration-300'>
                  Profile
                </span>
              </Link>
            </div>
          </div>
          {showMenu && (
            <div className="md:hidden flex text-white" id="mobile-menu">
            
              <div className="space-y-1 px-2 pb-3 pt-2">
                <Link href={profileLink} className='block py-2 px-4 flex items-center gap-1 hover:text-teal-300 duration-500'>
                  <img src="profile.png" alt="Profile" className="inline-block mr-2 h-5 w-5" />
                  <span className='text-gradient hover:underline decoration-2 decoration-transparent hover:decoration-purple-800 transition-all duration-300'>
                    Profile
                  </span>
                </Link>
                <Link href='/map' className='block py-2 px-4 flex items-center gap-1 hover:text-teal-300 duration-500'>
                  <img src="location-pin.png" alt="Map" className="inline-block mr-2 h-5 w-5" />
                  <span className='text-gradient hover:underline decoration-2 decoration-transparent hover:decoration-purple-800 transition-all duration-300'>
                    Map
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;