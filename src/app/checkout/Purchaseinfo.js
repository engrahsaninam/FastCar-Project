'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CreditCard,
  Shield,
  FileText,
  Car,
  Info,
  Check,
  ArrowRight
} from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "How to make a purchase",
    icon: Info,
    tag: "Overview",
    content: "You are just a few steps away from your new car! The total price includes everything you need: MOT, registration, and delivery. No hidden fees or additional charges unless you opt for extra services.",
    image: "/1.png",
    bgColor: "bg-blue-50"
  },
  {
    id: 2,
    title: "Payment method",
    icon: CreditCard,
    tag: "Step 1",
    subTitle: "Secure Payment",
    price: "CZK 567,265",
    priceLabel: "TOTAL PRICE INCLUDING ALL SERVICES",
    content: "Choose your preferred payment method",
    image: "/2.png",
    bgColor: "bg-red-50"
  },
  {
    id: 3,
    title: "Car Inspection",
    icon: Car,
    tag: "Step 2",
    subTitle: "Thorough Check",
    content: "We perform a comprehensive inspection of the car's condition for CZK 1,990. You'll receive a detailed technical report to help make an informed decision.",
    image: "/3.png",
    bgColor: "bg-green-50"
  },
  {
    id: 4,
    title: "Warranty Coverage",
    icon: Shield,
    tag: "Step 3",
    subTitle: "Full Protection",
    content: "Purchase directly through us for complete warranty coverage. All contracts are in English, ensuring total transparency and understanding.",
    image: "/warranty.webp",
    bgColor: "bg-amber-50"
  },
  {
    id: 5,
    title: "Contract Review",
    icon: FileText,
    tag: "Final Step",
    subTitle: "Full Transparency",
    content: "Review your purchase contract at home before making any commitments. Available in English with our support team ready to answer any questions.",
    image: "/contract.webp",
    bgColor: "bg-purple-50"
  }
];

const SlideContent = ({ slide, isMobile }) => {
  const Icon = slide.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className={`bg-red-50/90 p-8 rounded-2xl`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/80 backdrop-blur rounded-xl">
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">{slide.tag}</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{slide.title}</h3>
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'}`}>
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-contain "
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="space-y-4">
            {slide.price ? (
              <>
                <div className="text-red-500 font-semibold">{slide.content}</div>
                <h4 className="text-xl font-bold">{slide.subTitle}</h4>
                <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">{slide.priceLabel}</p>
                  <p className="text-2xl font-bold">{slide.price}</p>
                </div>
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 leading-relaxed">{slide.content}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StepIndicator = ({ currentStep, totalSteps, onStepClick }) => (
  <div className="flex gap-3">
    {slides.map((slide, index) => (
      <button
        key={index}
        onClick={() => onStepClick(index + 1)}
        className="group relative"
      >
        <div className={`
          w-3 h-3 rounded-full transition-all duration-300
          ${currentStep === index + 1 
            ? 'bg-red-500 ring-4 ring-red-100' 
            : currentStep > index + 1
              ? 'bg-green-500'
              : 'bg-gray-200'
          }
        `} />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {slide.tag}
        </div>
      </button>
    ))}
  </div>
);

const MobileSlider = ({ currentSlide, onClose, onNext, onPrev }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed inset-0 bg-white z-50"
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-gray-700" />
          <h2 className="font-bold text-gray-900">Purchase Guide</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <SlideContent slide={slides[currentSlide - 1]} isMobile={true} />
      </div>

      <div className="border-t p-4 bg-white">
        <div className="flex justify-between items-center">
          <StepIndicator 
            currentStep={currentSlide}
            totalSteps={slides.length}
            onStepClick={() => {}}
          />
          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={currentSlide === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              disabled={currentSlide === slides.length}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const DesktopSlider = ({ currentSlide, isExpanded, onToggleExpand, onNext, onPrev }) => {
  if (!isExpanded) {
    return (
      <motion.div 
        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <Car className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-bold">Purchase Guide</h2>
          </div>
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            View Steps
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-xl">
            <Car className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Purchase Guide</h2>
        </div>
        <button
          onClick={onToggleExpand}
          className="px-4 py-2 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors"
        >
          Close
        </button>
      </div>

      <AnimatePresence mode="wait">
        <SlideContent key={currentSlide} slide={slides[currentSlide - 1]} />
      </AnimatePresence>

      <div className="flex justify-between items-center mt-8 pt-8 border-t">
        <StepIndicator 
          currentStep={currentSlide}
          totalSteps={slides.length}
          onStepClick={() => {}}
        />
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={currentSlide === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            disabled={currentSlide === slides.length}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PurchaseInfo = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNext = () => setCurrentSlide(prev => Math.min(slides.length, prev + 1));
  const handlePrev = () => setCurrentSlide(prev => Math.max(1, prev - 1));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Mobile View */}
      <div className="md:hidden">
        <motion.div 
          onClick={() => setIsMobileOpen(true)}
          className="bg-white rounded-xl p-4 shadow-lg cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <Car className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="font-bold">Purchase Guide</h2>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        {isMobileOpen && (
          <MobileSlider
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
          currentSlide={currentSlide}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </div>
  );
};

export default PurchaseInfo;