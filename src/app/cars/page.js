// app/cars/page.js
"use client";

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import AppBar from '@/components/AppBar2';

// Dynamically import components with suspense
const Body = dynamic(() => import("@/components/Cars/Body"), {
  loading: () => <BodySkeleton />,
  ssr: false
});

const CarFilterUI = dynamic(() => import("@/components/Cars/CarListings"), {
  loading: () => <FilterSkeleton />,
  ssr: false
});

const Footer = dynamic(() => import("@/components/HomePage/Footer"), {
  ssr: true
});

// Loading skeletons
const BodySkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const FilterSkeleton = () => (
  <div className="animate-pulse p-4">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

export default function Cars() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <Suspense fallback={<BodySkeleton />}>
      {/* Main Container */}
      <AppBar/>
      <div className="flex flex-col md:flex-row min-h-screen md:bg-red-50/50">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block md:w-[27%] md:max-w-[400px] md:min-w-[320px]">
          <Suspense fallback={<FilterSkeleton />}>
            <CarFilterUI />
          </Suspense>
        </div>

        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />
        )}

        {/* Mobile Filter Sidebar */}
        <div 
          className={`
            fixed inset-y-0 left-0 w-full max-w-[320px] z-50 bg-white
            transform transition-transform duration-300 ease-in-out
            md:hidden
            ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Suspense fallback={<FilterSkeleton />}>
            <CarFilterUI 
              isMobileOpen={isMobileFilterOpen} 
              setIsMobileOpen={setIsMobileFilterOpen} 
            />
          </Suspense>
        </div>

        {/* Body - Full width on mobile, remaining space on desktop */}
        <div className="flex-1 w-full md:bg-red-50/50">
          <div className="px-0 md:px-6 py-1 md:py-4">
            <Suspense fallback={<BodySkeleton />}>
              <Body openMobileFilter={() => setIsMobileFilterOpen(true)} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </Suspense>
  );
}