"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import AppBar and CarDetailPage to improve performance by lazy loading
const DynamicAppBar = dynamic(() => import("@/components/AppBar2"), { ssr: false });
const DynamicCarDetailPage = dynamic(() => import("@/components/Cars/CarDetailPage"), { ssr: false });

export default function CarPage() {
  const [showAppBar, setShowAppBar] = useState(true);
  const [scrolling, setScrolling] = useState(false);

  // Use useEffect to ensure scroll event handling happens only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrolled = window.scrollY > 0;
            setShowAppBar(!scrolled); // Hide AppBar if scrolled, show it when at top
            ticking = false;
          });
          ticking = true;
        }
      };

      // Listen to the scroll event
      window.addEventListener("scroll", handleScroll);

      // Cleanup on component unmount
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="bg-red-50">
      <div
        className={`relative z-50 app-bar-element transition-opacity duration-200 ${
          showAppBar ? "opacity-100" : "opacity-90"
        }`}
      >
        {/* Wrap dynamic component in Suspense with a fallback */}
        <Suspense fallback={<div>Loading AppBar...</div>}>
          <DynamicAppBar />
        </Suspense>
      </div>
      
      {/* Wrap dynamic component in Suspense with a fallback */}
      <Suspense fallback={<div>Loading Car Details...</div>}>
        <DynamicCarDetailPage />
      </Suspense>
    </div>
  );
}
