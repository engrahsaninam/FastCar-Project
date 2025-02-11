'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Mobile Slider Component
const MobileSlider = ({ slides, currentSlide, onClose, onNext, onPrev }) => {
  const currentSlideData = slides[currentSlide - 1];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">How to make a purchase</h2>
        <button onClick={onClose} className="p-2">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 h-[calc(100vh-140px)] overflow-y-auto">
        <div className="space-y-6">
          {/* Image */}
          <div className="relative aspect- w-full max-w-sm mx-auto">
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Title & Content */}
          <div>
            <h3 className="text-xl font-bold mb-3">{currentSlideData.title}</h3>
            {currentSlide === 2 ? (
              <div>
                <div className="text-red-500 font-semibold mb-2">{currentSlideData.content}</div>
                <h3 className="text-xl font-bold mb-4">{currentSlideData.subTitle}</h3>
                <div className="bg-red-50/90 text-black p-4 rounded-lg">
                  <div className="text-sm mb-1">{currentSlideData.priceLabel}</div>
                  <div className="text-xl font-bold">{currentSlideData.price}</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentSlideData.content}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className={`w-2 h-2 rounded-full ${currentSlide === dot ? 'bg-red-400' : 'bg-gray-200'
                  }`}
              />
            ))}
          </div>
          <div className="text-gray-500 text-sm">
            {currentSlide} / 5
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              onClick={onPrev}
              disabled={currentSlide === 1}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              onClick={onNext}
              disabled={currentSlide === 5}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Desktop Slider Component
const DesktopSlider = ({ slides, currentSlide, isExpanded, onToggleExpand, onNext, onPrev }) => {
  const currentSlideData = slides[currentSlide - 1];

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">How to make a purchase</h2>
          <button
            className="text-red-500 hover:text-red-600 font-medium"
            onClick={onToggleExpand}
          >
            Find out more
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">{currentSlideData.title}</h2>
        <button
          className="text-red-500 hover:text-red-600 font-medium"
          onClick={onToggleExpand}
        >
          Less
        </button>
      </div>

      <div className="flex gap-8">
        <div className="flex-shrink-0 w-80">
          <img
            src={currentSlideData.image}
            alt={currentSlideData.title}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          {currentSlide === 2 ? (
            <div>
              <div className="text-red-500 font-semibold mb-2">{currentSlideData.content}</div>
              <h3 className="text-2xl font-bold mb-4">{currentSlideData.subTitle}</h3>
              <div className="bg-red-50/90 text-black p-4 rounded-lg">
                <div className="text-sm mb-1">{currentSlideData.priceLabel}</div>
                <div className="text-2xl font-bold">{currentSlideData.price}</div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-lg leading-relaxed">{currentSlideData.content}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full transition-colors ${currentSlide === dot ? 'bg-red-400' : 'bg-gray-200'
                }`}
            />
          ))}
        </div>
        <div className="text-gray-500">
          {currentSlide} / 5
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            onClick={onPrev}
            disabled={currentSlide === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            onClick={onNext}
            disabled={currentSlide === 5}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component continues in Part 2...
// Main PurchaseInfo Component
const PurchaseInfo = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const slides = [
    {
      title: "How to make a purchase",
      content: "You are just a few steps away from your new car! What will probably interest you the most - the total price already includes everything you need to bring your new car, MOT and registration. If you do not want any additional services such as financing, insurance, warranty extension, air conditioning cleaning and others, you will not pay an extra euro.",
      image: "/1.png"
    },
    {
      title: "Payment method",
      content: "STEP 1",
      subTitle: "Payment method",
      price: "CZK 567,265",
      priceLabel: "TOTAL PRICE OF THE CAR INCL. SERVICES",
      image: "/2.png"
    },
    {
      title: "Check the car first, decide later",
      content: "STEP 2",
      subTitle: "Car condition check",
      content: "At the first we do the physical check of the Car condition . It costs just CZK 1,990 and as a result, we create a complete report for you on the technical condition of the car. Taking into account that the car is used, we will always provide you with our comment and recommendation if the price is fitting the technical condition of the car. It helps you to decide if you want the car or not. If not, we are keen to help you find others.",
      image: "/3.png"
    },
    {
      title: "We keep warranty",
      content: "STEP 3",
      subTitle: "Warranty",
      content: "If you decide on a car, we will buy it from the original dealer, and you will then buy it from us. This means that you are signing a contract with us - Carvago. Thanks to that, the contract is nice in English, so you understand everything. And also that you are applying for a car warranty from us, not an unknown company somewhere abroad, which may not exist tomorrow. Good, right?",
      image: "/warranty.webp"
    },
    {
      title: "You can read the contract in advance",
      content: "Before you place a binding order after the inspection, you have a purchase contract at your disposal, which you can read at home. In English, of course. And if something is not clear to you, we are here for you on chat or phone. No surprises.",
      image: "/contract.webp"
    }
  ];

  const handleNext = () => {
    setCurrentSlide(prev => Math.min(5, prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide(prev => Math.max(1, prev - 1));
  };

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="w-full bg-white rounded-lg px-4 py-4 mb-4 shadow-sm">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-bold text-[#1e2b4d]">How to make a purchase</h2>
            <button
              className="text-red-500 hover:text-red-600 text-sm font-medium"
              onClick={() => setIsMobileOpen(true)}
            >
              Find out more
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <MobileSlider
            slides={slides}
            currentSlide={currentSlide}
            onClose={() => setIsMobileOpen(false)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DesktopSlider
          slides={slides}
          currentSlide={currentSlide}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </>
  );
};

export default PurchaseInfo;