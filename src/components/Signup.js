
import React from 'react';
import {  X, Eye, EyeOff } from 'lucide-react';

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


  export default SignupModal;