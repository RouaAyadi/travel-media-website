//profile navbar 

"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

import { useRouter } from 'next/navigation';
import { useUserContext, LogoutUser } from '../../../store/User';


const Navbar5 = ({pic ,fn,ln,onSearch}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  

  const handleLogout = async (dispatch, router) => {
    try {
      await LogoutUser(dispatch);
      router.push('/log'); 
    } catch (error) {
      console.error('Failed to Log out:', error);
    }
  };

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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/trips?populate=*&filters[user_profile][id][$eq]=${userId}`, {
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
  const { dispatch } = useUserContext();
  const router = useRouter();

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
            
            <div className="relative flex h-20 items-center justify-between px-8 md:px-6">
              <div className="flex items-center space-x-2">
                <Link href='/'>
                  <div className="flex items-center">
                    <img className="h-12 w-auto max-w-xs" src="logo.png" alt="Logo" />
                    <p className='text-xl font-bold font-sans-serif leading-none text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 uppercase pt-4'>
                      TravelMedia
                    </p>
                  </div>
                </Link>
                
              
                
              </div>
            </div>
            
            
            <div className='hidden md:flex items-center justify-center flex-grow'>
        <div className='flex items-center gap-4'>
            <input
            type="text"
            className="rounded-full border-2 border-blue-950 px-6 py-3 text-lg text-blue-900 placeholder-blue-950 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
            placeholder="Where do you want to go?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
                type="button"
                className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300">
                    Search
            </button>

        </div>
        </div>

           
            <div className='flex text-white gap-12 pr-2'>
              <Link href='/Map' className='flex items-center gap-1 hover:text-gray-300 duration-500'>
                <button href="#" class="block py-2 px-3  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 text-lg dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                 Map
                </button>
              </Link>
              
              <div className='relative flex justify-end items-center h-full cursor-pointer'>
              <div class="text-right mr-[10px] text-black md:block"><p class="text-primary font-bold text-button_m whitespace-nowrap">{fn} {ln}</p></div>
              <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={pic}
                    className="h-10 w-10 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a href={profileLink} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="/" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Home
                  </a>
                </MenuItem>
                <MenuItem onClick={() => handleLogout(dispatch, router)}>
                  <a href="/" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
            </div>

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

export default Navbar5;