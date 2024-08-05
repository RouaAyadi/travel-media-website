// src/components/SideNavbar.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserContext, LogoutUser } from '../../../store/User';
import { useState } from 'react';

const handleLogout = async (dispatch, router) => {
  try {
    await LogoutUser(dispatch);
    router.push('/log'); 
  } catch (error) {
    console.error('Failed to Log out:', error);
  }
};

export default function SideNavbar() {
  const { dispatch } = useUserContext();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => {
    setIsOpen(true);
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  };

  const closeNav = () => {
    setIsOpen(false);
    document.body.style.backgroundColor = "white";
  };

  return (
    <>
      <div
        className={`h-screen bg-gradient-to-b from-green-400 via-teal-700 to-purple-800 fixed top-0 left-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
        id="mySidenav"
      >
        <div className={`p-6 ${isOpen ? 'block' : 'hidden'}`}>
          <h1 className="text-2xl font-bold">Travel Media</h1>
          <button onClick={closeNav} className="text-white text-xl absolute top-4 right-4">&times;</button>
        </div>
        <nav className={`mt-10 ${isOpen ? 'block' : 'hidden'}`}>
          <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Home
          </Link>
          <Link href="/Map" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
          Map
          </Link>
          <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            About
          </Link>
          <button
            onClick={() => handleLogout(dispatch, router)}
            className="block py-2.5 px-4 w-full text-left rounded transition duration-200 hover:bg-gray-700"
          >
            Log out
          </button>
        </nav>
      </div>
      <div id="main" className="transition-all duration-300 ease-in-out">
        {!isOpen && (
          <img
            src="menu.png"
            alt="Open Menu"
            onClick={openNav}
            className="cursor-pointer fixed top-4 left-4 w-10 h-10"
            style={{ zIndex: 1000 }} // Ensure the image is above other elements
          />
        )}
      </div>
    </>
  );
}
