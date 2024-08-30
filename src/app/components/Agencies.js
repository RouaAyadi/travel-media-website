import React, { useEffect, useState } from 'react';

const Agencies = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`bg-white p-5 h-2/3 rounded-lg shadow-md-gray mb-4 fixed w-[300px] mt-80 right-20 ml-9 hidden lg:block transition-transform duration-300 ease-in-out ${
        scrolled ? '-translate-y-80' : 'translate-y-0'
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Agencies</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
            <img src="/traveltodo.png" alt="Clinic Icon" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-base">TravelTodo</h3>
            <p className="text-gray-600 text-sm">Travel Agency</p>
          </div>
        </div>
        <a href="https://www.traveltodo.com/" target="_blank" rel="noopener noreferrer">
          <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">View</button>
        </a>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
            <img src="/rosa.jpg" alt="Clinic Icon" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-base">Rosa Travel</h3>
            <p className="text-gray-600 text-sm">Travel Agency</p>
          </div>
        </div>
        <a href="https://rosatravel.tn/" target="_blank" rel="noopener noreferrer">
          <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">View</button>
        </a>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
            <img src="/israa.png" alt="Clinic Icon" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-base">Israa Travel</h3>
            <p className="text-gray-600 text-sm">Travel Agency</p>
          </div>
        </div>
        <a href="https://israatravel.com/" target="_blank" rel="noopener noreferrer">
          <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">View</button>
        </a>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIY0i14rThwqzGZDOR9TesGITAfwFwmODJWA&s" alt="Clinic Icon" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-base">Tunisie Promo</h3>
            <p className="text-gray-600 text-sm">Travel Agency</p>
          </div>
        </div>
        <a href="https://www.tunisiepromo.tn/" target="_blank" rel="noopener noreferrer">
          <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">View</button>
        </a>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZt5R84V2yOXHQOfI9Apm1b8xmiEkzpkAaFw&s" alt="Clinic Icon" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-base">ACTIVE TRAVEL</h3>
            <p className="text-gray-600 text-sm">Travel Agency</p>
          </div>
        </div>
        <a href="https://activetravel.com.tn/" target="_blank" rel="noopener noreferrer">
          <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">View</button>
        </a>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
            <img src="https://yt3.googleusercontent.com/SvCVw_aBJ8_trOC0fUayzriXQN2CgXYtp1nBIxahGLGvF1i3WuhcPZP-tZgO0AWnWAMFaurxaSc=s900-c-k-c0x00ffffff-no-rj" alt="Clinic Icon" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-base">Tunisie Booking</h3>
            <p className="text-gray-600 text-sm">Travel Agency</p>
          </div>
        </div>
        <a href="https://tn.tunisiebooking.com/?srsltid=AfmBOoobO-yayBcGJS_bwTArB97v3BEfdMvZfLqWcEDHAyGI_LbcLHmV" target="_blank" rel="noopener noreferrer">
          <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">View</button>
        </a>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden h-10 w-10 border-2 border-indigo-900">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPwN_M56zFJK-Eg7KNFfxSszEz66P-Q6imRQ&s" alt="Clinic Icon" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-base">Jektis Travel</h3>
            <p className="text-gray-600 text-sm">Travel Agency</p>
          </div>
        </div>
        <a href="https://www.jektistravel.com/" target="_blank" rel="noopener noreferrer">
          <button className="bg-indigo-900 text-white py-1 px-4 text-sm rounded-full">View</button>
        </a>
      </div>
    </div>
  );
};

export default Agencies;
