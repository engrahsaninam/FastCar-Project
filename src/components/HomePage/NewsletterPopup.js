'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds on every page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would send this to your backend
      console.log('Email saved for newsletter:', email);
      
      // Mark as subscribed for current session
      setSubscribed(true);
      
      // Show success message for 2 seconds then close
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 flex z-50 items-center justify-center ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    } transition-opacity duration-300`}>
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className={`relative bg-red-50/85 rounded-lg w-full max-w-md transform transition-all duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">Stay Updated!</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              Do you want to hear more from us? Subscribe to our Newsletter!
            </p>
            <p className="text-red-500 font-semibold">
              Enjoy launch discounts and exclusive deals
            </p>

            {subscribed ? (
              <div className="text-center text-green-600 py-2 font-medium">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                  <div className="mt-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full px-4 py-3 border bg-red-50/70 border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-transparent outline-none transition-all"
                      required
                      disabled={isLoading}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>
            )}
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By subscribing, you agree to receive marketing emails from us. 
              You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;