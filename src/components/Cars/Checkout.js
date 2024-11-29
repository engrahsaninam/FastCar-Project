"use client";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Lock, 
  Check,
} from 'lucide-react';

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const value = formatCardNumber(e.target.value);
    if (value.length <= 19) {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e) => {
    const value = formatExpiry(e.target.value);
    if (value.length <= 5) {
      setExpiry(value);
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 3) {
      setCvc(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Implement Stripe payment processing here
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[450px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-500 mt-2">Enter your payment details to complete the purchase</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Order total</span>
            <span className="text-xl font-bold text-gray-900">$199.00</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Payments are secure and encrypted</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6">
          {/* Card number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <img src="/api/placeholder/32/20" alt="Card types" className="h-5" />
              </div>
            </div>
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry date
              </label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name on card
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Save Card Checkbox */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                  saveCard ? 'bg-blue-500 border-blue-500' : 'border-gray-300 group-hover:border-blue-500'
                }`}
                onClick={() => setSaveCard(!saveCard)}
              >
                {saveCard && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-sm text-gray-700">Save card for future payments</span>
            </label>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg transition-all relative overflow-hidden disabled:opacity-70"
          >
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <span>Pay $199.00</span>
            )}
          </button>

          {/* Payment Methods */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <img src="/api/placeholder/32/20" alt="Visa" className="h-6" />
            <img src="/api/placeholder/32/20" alt="Mastercard" className="h-6" />
            <img src="/api/placeholder/32/20" alt="Amex" className="h-6" />
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By completing this purchase you agree to our</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <a href="#" className="text-blue-500 hover:text-blue-600">Terms of Service</a>
            <span>&middot;</span>
            <a href="#" className="text-blue-500 hover:text-blue-600">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;