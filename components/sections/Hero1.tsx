"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import HeroSearch from '../elements/HeroSearch';
import { Heading } from "@chakra-ui/react";

export default function HeroWithSearch() {
  const [activeTab, setActiveTab] = useState<'all' | 'advanced'>('all');
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: 'all' | 'advanced', e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);

    if (tab === 'advanced' && searchBoxRef.current) {
      // Use setTimeout to ensure the state update is processed first
      setTimeout(() => {
        const searchBox = searchBoxRef.current;
        if (!searchBox) return;

        // Calculate the absolute position of the search box
        const searchBoxRect = searchBox.getBoundingClientRect();
        const absoluteSearchBoxTop = window.scrollY + searchBoxRect.top;

        // Calculate the desired scroll position (accounting for the translateY)
        const scrollPosition = absoluteSearchBoxTop - 100 - 20; // 100px for translateY, 20px padding

        // Only scroll if we're not already at the correct position
        if (Math.abs(window.scrollY - scrollPosition) > 10) {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      }, 0);
    }
  };

  return (
    <>
      <section className="box-section block-banner-home1 position-relative android-hero" style={{ overflow: "hidden" }}>
        <div className="container position-relative z-1">
          {/* Hero Content */}
          <div className="row row-mobile" style={{ marginBottom: "270px" }}>
            <div className="col-12">
              <p className="text-primary text-md-bold wow fadeInUp pb-2">We Inspect It And Deliver It</p>
              <Heading
                color="white"
                fontSize={{ base: '30px', md: '5xl' }}
                lineHeight="shorter"
                marginBottom={8}
                data-wow-delay="0.2s"
                className=" wow fadeInUp"

                style={{ fontFamily: "satoshi", fontWeight: 900 }}
              >
                Your Car, From Europe.

              </Heading>
              <ul className="list-ticks-green android-hide">
                <li className="wow fadeInUp" data-wow-delay="0.1s">High quality at a low cost.</li>
                <li className="wow fadeInUp" data-wow-delay="0.2s">Premium services</li>
                <li className="wow fadeInUp" data-wow-delay="0.4s">24/7 roadside support.</li>
              </ul>
            </div>
          </div>

          {/* Search Box Inside Container - Removed absolute positioning */}
          <div
            ref={searchBoxRef}
            className="box-search-advance background-card rounded-xl mt-4 mb-4 search-box-transform"
            style={{
              transform: "translateY(-100px)"
            }}
          >
            <div className="box-top-search d-flex justify-content-between align-items-center mb-3">
              <div className="left-top-search">
                <Link
                  className={`category-link text-sm-bold btn-click ${activeTab === 'all' ? 'active' : ''} me-3`}
                  href="#"
                  onClick={(e) => handleTabChange('all', e)}
                >
                  All cars
                </Link>
                <Link
                  className={`category-link text-sm-bold btn-click ${activeTab === 'advanced' ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => handleTabChange('advanced', e)}
                >
                  Advanced Search
                </Link>
              </div>
              <div className="right-top-search d-none d-md-flex">
                <Link className="text-sm-medium need-some-help" href="/contact">Need help?</Link>
              </div>
            </div>
            <HeroSearch showAdvanced={activeTab === 'advanced'} />
          </div>
          {/* <div className="container"> */}
          <div className="box-search-category d-flex flex-column align-items-center">
            <h4 className={`heading-3 text-center wow fadeInUp text-white`}>Offical Partner</h4>
            <div className="d-flex flex-column align-items-center">
              <p className="text-lg-medium text-white  text-center wow fadeInUp mb-0">Exclusive partner of AutoScout24</p>
            </div>

            <div className="d-flex wow fadeInUp">
              <img
                src="/logoautodark.png"
                alt="Auto Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  margin: '0 auto',
                  // display: 'block'
                }}
              />
            </div>
          </div>
        </div>
        {/* </div> */}
        <div className="bg-shape z-0" />

      </section>

    </>
  );
}