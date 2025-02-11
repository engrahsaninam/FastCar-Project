"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Heart, User, Menu, Bookmark, Clock, ShoppingCart } from 'lucide-react';
import logo from '@/assets/logo.png'
import english from '@/assets/english.png'
import cestina from '@/assets/cestina.svg'
import LoginModal from './Login';
import SignupModal from './Signup';
// Language state management
const languages = [
  { id: 'cs', name: 'Čeština', flag: cestina.src },
  { id: 'en', name: 'English', flag: english.src }
];


const MobileLanguageSelector = ({ isOpen, onClose, selectedLang, onSelectLang }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-[80]"
        onClick={onClose}
      />

      <div className="fixed bottom-0 left-0 right-0 z-[81] bg-white rounded-t-[16px] transform transition-transform duration-200 ease-out">
        <div className="flex items-center justify-between px-5 h-14 border-b border-[#E5E7EB]">
          <h2 className="text-[18px] font-medium text-[#1A1A1A]">Language</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="px-5 py-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                onSelectLang(lang.id);
                onClose();
              }}
              className={`flex items-center w-full h-14 ${selectedLang === lang.id ? 'text-[#EF4444]' : 'text-[#6B7280] hover:text-[#EF4444]'
                } transition-colors`}
            >
              <img src={lang.flag} alt={`${lang.name} Flag`} className="w-[22px] h-[22px] rounded-full" />
              <span className="ml-[14px] text-[15px] leading-5 font-medium">
                {lang.name}
              </span>
              {selectedLang === lang.id && (
                <div className="ml-auto">
                  <div className="w-4 h-4 rounded-full bg-[#EF4444] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const DesktopLanguageSelector = ({ selectedLang, onSelectLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const selectedLanguage = languages.find(lang => lang.id === selectedLang);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay before closing
  };

  return (
    <div className="relative hidden lg:block">
      <button
        className="p-2 hover:opacity-80 transition-opacity flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={selectedLanguage?.flag}
          alt={`${selectedLanguage?.name} Flag`}
          className="w-[22px] h-[22px] rounded-full object-cover"
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-[-30px] top-[calc(100%+8px)] w-[180px] bg-white rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB] py-2 z-[90]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                onSelectLang(lang.id);
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 h-10 ${selectedLang === lang.id
                  ? 'text-[#EF4444]'
                  : 'text-[#1A1A1A] hover:text-[#EF4444]'
                } hover:bg-[#F9FAFB] transition-colors`}
            >
              <img
                src={lang.flag}
                alt={`${lang.name} Flag`}
                className="w-[22px] h-[22px] rounded-full"
              />
              <span className="ml-3 text-[15px] leading-5 font-medium">
                {lang.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AuthDropdown = ({ onClose, isMobile, selectedLang, onSelectLang, setShowLoginModal, setShowSignupModal }) => {
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const selectedLanguage = languages.find(lang => lang.id === selectedLang);

  return (
    <>
      <div className={`
        fixed top-0 right-0 bottom-0 w-[300px] z-[70] bg-white flex flex-col
        lg:absolute lg:top-[calc(100%+8px)] lg:w-[320px] lg:h-auto lg:bottom-auto 
        lg:rounded-[8px] lg:shadow-[0_2px_8px_rgba(0,0,0,0.08)] lg:border lg:border-[#E5E7EB]
        transition-transform duration-200 ease-out ${isMobile ? 'translate-x-0' : ''}
      `}>

        <div className="flex flex-col h-full bg-white lg:rounded-[8px] overflow-hidden">
          {/* Mobile close button */}
          <div className="h-14 flex items-center justify-end px-5 border-b border-[#E5E7EB] lg:hidden">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-5">
            <div className="py-2 space-y-1">
              <Link text="Saved searches" icon={Bookmark} />
              <Link text="Last searches" icon={Clock} />
              <Link text="Favorite cars" icon={Heart} />
              <Link text="Orders in progress" icon={ShoppingCart} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto">
            <div className="px-5 py-4 border-t border-[#E5E7EB]">
              <button
                onClick={() => {
                  onClose();
                  setShowLoginModal(true);
                }}
                className="w-full h-[48px] bg-[#EF4444] hover:bg-[#D93C0B] text-white rounded-[8px] text-[15px] font-medium flex items-center justify-center transition-all duration-200"
              >
                <User className="w-[22px] h-[22px] mr-2" strokeWidth={1.5} />
                Login
              </button>
              <p className="text-[15px] text-center mt-4 text-[#6B7280]">
                Don't have an account?
                <button
                  onClick={() => {
                    onClose();
                    setShowSignupModal(true);
                  }}
                  className="text-[#EF4444] font-medium ml-1 hover:underline"
                >
                  Register
                </button>
              </p>
            </div>

            {/* Language Selector Button - Mobile Only */}
            <div className="lg:hidden px-5 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB]">
              <button
                onClick={() => setIsLanguageSelectorOpen(true)}
                className="flex items-center h-[42px] w-full hover:text-[#EF4444] transition-colors"
              >
                <img
                  src={selectedLanguage?.flag}
                  alt={`${selectedLanguage?.name} Flag`}
                  className="w-[22px] h-[22px] rounded-full"
                />
                <span className="ml-[14px] text-[15px] leading-5 font-medium text-[#1A1A1A]">
                  {selectedLanguage?.name} ({selectedLang.toUpperCase()})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <MobileLanguageSelector
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
        selectedLang={selectedLang}
        onSelectLang={onSelectLang}
      />
    </>
  );
};

// Navigation data structure
const navigationLinks = [
  {
    id: 'buy',
    label: 'Buy',
    href: '/cars',
    type: 'link'
  },
  {
    id: 'best-deals',
    label: 'Best Deals',
    href: '/best-deals',
    type: 'link'
  },
  {
    id: 'Import-process',
    label: 'Import Process',
    href: '/import-process',
    type: 'link'
  },
  {
    id: 'services',
    label: 'Services',
    type: 'dropdown',
    items: [
      { id: 'financing', label: 'Car Financing', href: '/services/finance' },
      { id: 'Safe Purchase Program', label: 'Safe Purchase Program', href: '/services/safe-purchase' },
      { id: 'inspection', label: 'Vehicle Inspection', href: '/services/inspect' },
    ]
  },
  {
    id: 'news',
    label: 'News',
    href: '/blog',
    type: 'link'
  },
  {
    id: 'About',
    label: 'About',
    href: '/about',
    type: 'link'
  },
  // {
  //   id: 'electric-hybrid',
  //   label: 'Electric & Hybrid',
  //   href: '/electric-hybrid',
  //   type: 'link',
  //   badge: {
  //     text: 'NEW',
  //     color: 'bg-orange-500'
  //   }
  // }
];

const ServicesDropdown = ({ isOpen }) => {
  if (!isOpen) return null;

  const services = navigationLinks.find(link => link.id === 'services').items;

  return (
    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
      {services.map(service => (
        <a
          key={service.id}
          href={service.href}
          className="block px-4 py-2 text-[15px] text-gray-600 hover:text-[#EF4444] hover:bg-gray-50 transition-colors"
        >
          {service.label}
        </a>
      ))}
    </div>
  );
};

const NavLink = ({ link }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (link.type === 'dropdown') {
    return (
      <div className="relative" onMouseLeave={() => setIsDropdownOpen(false)}>
        <button
          onMouseEnter={() => setIsDropdownOpen(true)}
          className="px-1 py-6 text-[15px] font-medium text-[#6B7280] hover:text-[#EF4444] transition-colors inline-flex items-center group"
        >
          {link.label}
          <ChevronDown
            className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            strokeWidth={1.5}
          />
        </button>
        <ServicesDropdown isOpen={isDropdownOpen} />
      </div>
    );
  }

  return (
    <a
      href={link.href}
      className="px-1 py-6 text-[15px] font-medium text-[#6B7280] hover:text-[#EF4444] transition-colors relative group"
    >
      {link.label}
      {link.badge && (
        <span className={`ml-2 px-2 py-0.5 text-[11px] font-medium ${link.badge.color} text-white rounded-full leading-none`}>
          {link.badge.text}
        </span>
      )}
      <span className="absolute bottom-[1px] left-0 w-full h-[3.5px] rounded-lg bg-[#EF4444] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
    </a>
  );
};


// Link component for menu items
const Link = ({ text, icon: Icon }) => (
  <a href="#" className="flex items-center h-[52px] text-[#1A1A1A] hover:text-[#EF4444] transition-colors group">
    <Icon className="w-[22px] h-[22px] text-[#EF4444]" strokeWidth={1.5} />
    <span className="ml-[14px] text-[15px] leading-5 font-medium">{text}</span>
  </a>
);

const CarvagoNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    countryCode: '+34'
  });


  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signup attempt with:', formData);
  };

  const handleInputChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsLoginOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <>
      <header className="relative top-0 left-0 right-0 z-50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <nav className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex items-center text-[#1A1A1A] hover:text-[#EF4444] transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm font-medium ml-2">Menu</span>
            </button>

            {/* Logo */}
            <a href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:ml-0 transition-all">
              <img src={logo.src} alt="" className="object-contain size-24" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationLinks.map(link => (
                <NavLink key={link.id} link={link} />
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-1">
              <button className="p-2 text-[#1A1A1A] hover:text-[#EF4444] transition-colors">
                <Heart className="w-[22px] h-[22px]" strokeWidth={1.5} />
              </button>

              <DesktopLanguageSelector
                selectedLang={selectedLang}
                onSelectLang={setSelectedLang}
              />

              {/* Login Button */}
              <div className="relative">
                <button
                  onClick={() => setIsLoginOpen(!isLoginOpen)}
                  className="p-2 inline-flex items-center text-[#1A1A1A] hover:text-[#EF4444] transition-colors group"
                >
                  <User className="w-[22px] h-[22px]" strokeWidth={1.5} />
                  <span className="hidden lg:inline ml-2 text-[15px] font-medium">Login</span>
                  <ChevronDown className="hidden lg:inline ml-1 w-4 h-4" strokeWidth={1.5} />
                </button>

                {isLoginOpen && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/20 z-60 lg:hidden"
                      onClick={closeAll}
                    />
                    <AuthDropdown
                      onClose={closeAll}
                      isMobile={isMobile}
                      selectedLang={selectedLang}
                      onSelectLang={setSelectedLang}
                      setShowLoginModal={setShowLoginModal}
                      setShowSignupModal={setShowSignupModal}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-white">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
              <img src={logo.src} alt="" className="object-contain size-24" />
              <button onClick={closeAll} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-[22px] h-[22px]" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="px-4 py-2">
              <div className="space-y-1">
                <a href="/" className="block px-3 py-3 text-[#6B7280] text-[16px] font-medium hover:text-[#EF4444] transition-colors">
                  Home
                </a>
                {navigationLinks.map(link => (
                  <div key={link.id}>
                    {link.type === 'dropdown' ? (
                      <>
                        <button
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                          className="w-full flex items-center justify-between px-3 py-3 text-[#6B7280] text-[16px] font-medium hover:text-[#EF4444] transition-colors"
                        >
                          {link.label}
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                            strokeWidth={1.5}
                          />
                        </button>
                        {isServicesOpen && (
                          <div className="pl-6 py-2 space-y-2 bg-gray-50">
                            {link.items.map(item => (
                              <a
                                key={item.id}
                                href={item.href}
                                className="block px-3 py-2 text-[#6B7280] text-[15px] font-medium hover:text-[#EF4444] transition-colors"
                              >
                                {item.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <a
                        href={link.href}
                        className="block px-3 py-3 text-[#6B7280] text-[16px] font-medium hover:text-[#EF4444] transition-colors"
                      >
                        {link.label}
                        {link.badge && (
                          <span className={`ml-2 px-2 py-0.5 text-[11px] font-medium ${link.badge.color} text-white rounded-full`}>
                            {link.badge.text}
                          </span>
                        )}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

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
      showForm={showForm}
      setShowForm={setShowForm}
      formData={formData}
      handleInputChange={handleInputChange}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      handleSignup={handleSignup}
    />

    </>

  );
};

export default CarvagoNav;
