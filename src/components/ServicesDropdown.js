'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ServicesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  let timeoutId;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mouse/touch interactions
  const handleInteractionStart = () => {
    if (!isMobile) {
      clearTimeout(timeoutId);
      setIsOpen(true);
    }
  };

  const handleInteractionEnd = () => {
    if (!isMobile) {
      timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 100);
    }
  };

  // Toggle for mobile
  const handleClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && !event.target.closest('.services-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isOpen]);

  return (
    <div 
      className="relative inline-block text-left services-dropdown" 
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
    >
      {/* Dropdown Button */}
      <button
        onClick={handleClick}
        className="inline-flex justify-center w-full  text-white hover:text-red-400 hover:bg-gray-50/40 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Services
        <svg
          className={`-mr-1 ml-2 h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200 ${
          isOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-2 invisible'
        }`}
      >
        <div className="py-1">
          <Link
            href="/services_page/safepurchase"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => isMobile && setIsOpen(false)}
          >
            Safe Purchase
          </Link>
          <Link
            href="/services_page/inspect"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => isMobile && setIsOpen(false)}
          >
            Inspect Car
          </Link>
          <Link
            href="/services_page/fnance"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => isMobile && setIsOpen(false)}
          >
            Car Financing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesDropdown;