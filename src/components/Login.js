'use client';

import React from 'react';
import {  X, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';


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
  
export default LoginModal;