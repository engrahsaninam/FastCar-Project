'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Eye, EyeOff, Heart, BookmarkIcon, Clock, ShoppingCart, CircleUser, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';



const Select = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-full bg-gray-200" />
      <div className="w-16 h-5 bg-gray-200 rounded" />
    </div>
  )
});

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '9999px',
    padding: '2px 2px',
    minWidth: '80px',
    backgroundColor: '#D3390D',
    border: 'none',
    boxShadow: 'none',
  }),
  option: (provided) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
  }),
  singleValue: (provided, { selectProps }) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: selectProps.isScrolled ? 'black' : 'white',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
  }),
};

const languageOptions = [
  { value: 'EN', label: 'English', flag: '/flags/en.png' },
  { value: 'ES', label: 'Español', flag: '/flags/es.png' },
];

const UserDropdown = ({ setShowLoginModal, setShowSignupModal }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  let hideDropdownTimeout;

  const handleMouseEnter = () => {
    clearTimeout(hideDropdownTimeout);
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    hideDropdownTimeout = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(hideDropdownTimeout);
  }, []);



  return (
    <div
      className="hidden md:flex relative text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center cursor-pointer">
        <CircleUser className="h-6 w-6 text-grey" />
        <ChevronDown className="text-grey" />
      </div>

      {isDropdownVisible && (
        <div className="absolute right-0 mt-6 w-64 bg-white rounded-md shadow-lg py-2 z-20">
          <Link href="cars?tab=saved">
          <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
            <BookmarkIcon className="h-4 w-4 mr-3 text-gray-500" />
            <span>Saved searches</span>
          </button>
          </Link>
          

          <Link href="/cars?tab=history">
          <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
            <Clock className="h-4 w-4 mr-3 text-gray-500" />
            <span>Last searches</span>
          </button>
          </Link>
         <Link href="/favourite-cars">
          <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
            <Heart className="h-4 w-4 mr-3 text-gray-500" />
            <span>Favorite cars</span>
          </button>
          </Link>
          

          <Link href="/orders-in-progress">
            <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
              <ShoppingCart className="h-4 w-4 mr-3 text-gray-500" />
              <span>Orders in progress</span>
            </button>
          </Link>

          <div className="px-4 py-3 border-t border-gray-100">
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full mb-2 px-4 py-2 text-white bg-[#EF4444] rounded-md hover:bg-[[#D93C0B]] transition-colors"
            >
              Login
            </button>

            <div className="text-sm text-gray-500 text-center">
              Don't have an account?
              <button
                onClick={() => setShowSignupModal(true)}
                className="text-blue-600 hover:text-blue-700 ml-1"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
        className="inline-flex justify-center w-full  text-black hover:text-red-400 hover:bg-gray-50/40 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
        className={`absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200 ${isOpen
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

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  setShowSignupModal,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  handleLogin
}) => {
  const [showEmailForm, setShowEmailForm] = React.useState(false);

  return (
    <div
      className={`fixed inset-0 flex z-50 items-center justify-center ${showLoginModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-300`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          setShowLoginModal(false);
          setShowEmailForm(false);
        }}
      />

      <div
        className={`relative bg-red-50/85 rounded-lg w-full max-w-md transform transition-all duration-300 ${showLoginModal ? 'scale-100' : 'scale-95'
          }`}
      >
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">Welcome back</h2>
            <button
              onClick={() => {
                setShowLoginModal(false);
                setShowEmailForm(false);
              }}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Don't have an account yet?{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowEmailForm(false);
                  setShowSignupModal(true);
                }}
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                Register here
              </button>
            </div>

            {!showEmailForm && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <button className="flex items-center justify-center px-4 py-2.5 border border-red-400 rounded-lg hover:bg-red-50 transition-colors">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Google</span>
                  </button>
                  <button className="flex items-center justify-center px-4 py-2.5 border border-red-400 rounded-lg hover:bg-red-50 transition-colors">
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-6 h-6 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Facebook</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <button
                      onClick={() => setShowEmailForm(true)}
                      className="px-4 py-2 text-gray-500 bg-red-50/85 hover:text-red-500 transition-colors rounded-md"
                    >
                      or via e-mail
                    </button>
                  </div>
                </div>
              </>
            )}

            {showEmailForm && (
              <>
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <button
                      onClick={() => setShowEmailForm(false)}
                      className="px-4 py-2 text-gray-500 bg-red-50/85 hover:text-red-500 transition-colors rounded-md"
                    >
                      Back to social login
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <div className="mt-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mt-1 relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <Link href="/forgot-password" className="text-red-500 text-sm font-medium hover:text-red-600">
                      Forgot your password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Login
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SignupModal = ({ 
  showSignupModal, 
  setShowSignupModal, 
  setShowLoginModal, 
  showForm, 
  setShowForm, 
  formData, 
  handleInputChange, 
  showPassword, 
  setShowPassword, 
  handleSignup 
}) => {
  const handleClose = () => {
    setShowSignupModal(false);
    setShowForm(false); // Reset form state when closing
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowForm(false); // Reset form state when switching
    setShowLoginModal(true);
  };

  return (
    <div
      className={`fixed inset-0 flex z-50 items-center justify-center ${
        showSignupModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } transition-opacity duration-300`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className={`relative bg-red-50/85 rounded-lg w-full max-w-md max-h-[90vh] transform transition-all duration-300 ${
          showSignupModal ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="px-8 pt-8 pb-6 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-transparent hover:scrollbar-thumb-red-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">Create Account</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={switchToLogin}
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                Login here
              </button>
            </div>

            {!showForm ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <button className="flex items-center justify-center px-4 py-2.5 border border-red-400 rounded-lg hover:bg-red-50 transition-colors">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Google</span>
                  </button>
                  <button className="flex items-center justify-center px-4 py-2.5 border border-red-400 rounded-lg hover:bg-red-50 transition-colors">
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Facebook</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <button
                      onClick={() => setShowForm(true)}
                      className="rounded-md px-4 py-2 text-gray-500 hover:text-gray-700 focus:outline-none bg-red-50/85"
                    >
                      Sign up with email
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <button
                      onClick={() => setShowForm(false)}
                      className="rounded-md px-4 py-2 text-gray-500 hover:text-gray-700 focus:outline-none flex items-center bg-red-50/85"
                    >
                       Back to Social Login
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                    placeholder="Email"
                    className="w-full px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange(e, 'password')}
                      placeholder="Password (min. 8 characters)"
                      className="w-full px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange(e, 'name')}
                      placeholder="Name"
                      className="px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                    />
                    <input
                      type="text"
                      value={formData.surname}
                      onChange={(e) => handleInputChange(e, 'surname')}
                      placeholder="Surname"
                      className="px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <select
                      className="w-24 px-2 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                      value={formData.countryCode}
                      onChange={(e) => handleInputChange(e, 'countryCode')}
                    >
                      <option>+34</option>
                    </select>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange(e, 'phone')}
                      placeholder="Telephone number"
                      className="flex-1 px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                      value={formData.country}
                      onChange={(e) => handleInputChange(e, 'country')}
                    >
                      <option value="">Select country</option>
                    </select>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange(e, 'postalCode')}
                      placeholder="Postal code"
                      className="px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange(e, 'agreeToTerms')}
                      className="rounded border-red-200 text-red-500 focus:ring-red-200"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the processing of{' '}
                      <a href="#" className="text-red-500 hover:text-red-600">
                        personal data
                      </a>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Register
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const AppBar = () => {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    phone: '',
    country: '',
    postalCode: '',
    agreeToTerms: false,
    countryCode: '+92'
  });
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showLoginModal || showSignupModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLoginModal, showSignupModal]);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signup attempt with:', formData);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '9999px',
      padding: '2px 4px',
      minWidth: '80px',
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
    }),
    option: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: isScrolled ? 'black' : 'white',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
    }),
  };

  const languageOptions = [
    { value: 'EN', label: 'English', flag: '/flags/en.png' },
    { value: 'ES', label: 'Español', flag: '/flags/es.png' },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header
        className={`sticky top-0 w-full bg-white border-b-2 border-gray-100 z-40 shadow-lg transition-all duration-300 
          ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
      >
        <nav className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Left Menu Items */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-xl font-bold text-white">
                    <Image
                      src="/Logo/logo.png.png"
                      alt="Logo"
                      width={100}
                      height={50}
                      className="inline-block"
                    />
                  </Link>
                  <span className="text-gray-600 text-2xl mx-5">|</span>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-1">
                    <Link
                      href="/cars"
                      className="text-black hover:text-red-400 hover:bg-gray-50/40 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Search
                    </Link>
                    <Link
                      href="/bestdealss"
                      className="text-black hover:text-red-400 hover:bg-gray-50/40 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Best Deals
                    </Link>
                    <div className="relative">
                      <ServicesDropdown />
                    </div>
                    <Link
                      href="/importproces"
                      className="text-black hover:text-red-400 hover:bg-gray-50/40 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Import process
                    </Link>
                    <Link
                      href="/blog"
                      className="text-black hover:text-red-400 hover:bg-gray-50/40 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      News
                    </Link>
                    <Link
                      href="/about"
                      className="text-black hover:text-red-400 hover:bg-gray-50/40 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      About
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Menu Items */}
              <div className="flex items-center space-x-4">
                <Heart className="text-gray-600 hover:text-red-500 cursor-pointer" />


                <UserDropdown
                  setShowLoginModal={setShowLoginModal}
                  setShowSignupModal={setShowSignupModal}
                />
                <button
                  onClick={() => setUserDropdownVisible(!userDropdownVisible)}
                  className="md:hidden p-2 rounded-full text-gray-600"
                >
                  <CircleUser className="h-6 w-6" />
                </button>
                <div className="md:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
            <div className="bg-white border-t border-gray-100 px-4 pt-2 pb-3 space-y-1">
              <Link href="/cars" className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base">
                Search
              </Link>
              <Link href="/bestdealss" className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base">
                Best Deals
              </Link>
              <div>
                <ServicesDropdown />
              </div>
              <Link href="/importproces" className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base">
                Import process
              </Link>
              <Link href="/blog" className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base">
                Blog
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base">
                About
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowLoginModal(true);
                }}
                className="block w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowSignupModal(true);
                }}
                className="block bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-base font-medium shadow-sm mx-2 mb-2 text-center transition-colors"
              >
                Sign up
              </button>

            </div>


          </div>

          {userDropdownVisible && (
         <div className="absolute right-0 mt-6 w-64 bg-white rounded-md shadow-lg py-2 z-20">
         <Link 
           href="/cars?tab=saved" 
           className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
           onClick={() => setIsDropdownVisible(false)}
         >
           <BookmarkIcon className="h-4 w-4 mr-3 text-gray-500" />
           <span>Saved searches</span>
         </Link>
       
         <Link 
  href={`/cars?tab=history`}
  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
  onClick={() => setIsDropdownVisible(false)}
>
  <Clock className="h-4 w-4 mr-3 text-gray-500" />
  <span>Last searches</span>
</Link>
       
         <Link 
           href="/favourite-cars" 
           className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
           onClick={() => setIsDropdownVisible(false)}
         >
           <Heart className="h-4 w-4 mr-3 text-gray-500" />
           <span>Favorite cars</span>
         </Link>
       
         <Link 
           href="/orders-in-progress" 
           className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
           onClick={() => setIsDropdownVisible(false)}
         >
           <ShoppingCart className="h-4 w-4 mr-3 text-gray-500" />
           <span>Orders in progress</span>
         </Link>
       
         <div className="px-4 py-3 border-t border-gray-100">
           <button
             onClick={() => {
               setIsDropdownVisible(false);
               setShowLoginModal(true);
             }}
             className="w-full mb-2 px-4 py-2 text-white bg-[#EF4444] rounded-md hover:bg-red-600 transition-colors"
           >
             Login
           </button>
       
           <div className="text-sm text-gray-500 text-center">
             Don't have an account?
             <button
               onClick={() => {
                 setIsDropdownVisible(false);
                 setShowSignupModal(true);
               }}
               className="text-red-500 hover:text-red-600 ml-1"
             >
               Register
             </button>
           </div>
         </div>
       </div>
       )}
     

        </nav>

      </header>

      {/* Render modals with props */}
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        setShowSignupModal={setShowSignupModal}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleLogin={handleLogin}

      />

      <SignupModal
        showSignupModal={showSignupModal}
        setShowSignupModal={setShowSignupModal}
        setShowLoginModal={setShowLoginModal}
        showForm={showForm}          // Add this
        setShowForm={setShowForm}
        formData={formData}
        setFormData={setFormData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleSignup={handleSignup}
      />
    </>
  );
};



export default AppBar;

