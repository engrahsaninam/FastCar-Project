"use client";
import { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

import { useState, useRef } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import {
  Box,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  useBreakpointValue,
  IconButton,
  Container,
  Select
} from "@chakra-ui/react";

import Layout from "@/components/layout/Layout";
import rawCarsData from "@/util/cars.json";
import useCarFilter from "@/util/useCarFilter";
import CarFilterUI from "@/components/sections/CarListings";
import Body, { CarListSkeleton } from "@/components/sections/Body";
import { usePriceRange } from '@/services/cars/useCars';

// Convert ratings to numbers for proper comparison
const carsData = rawCarsData.map((car) => ({
  ...car,
  rating: parseFloat(car.rating as string),
}));

export default function CarsList1() {
  const [activeTab, setActiveTab] = useState<"all" | "advanced">("all");
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: "all" | "advanced", e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  const {
    filter,
    setFilter,
    sortCriteria,
    setSortCriteria,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    uniqueNames,
    uniqueFuelTypes,
    uniqueAmenities,
    uniqueLocations,
    uniqueRatings,
    uniqueCarTypes,
    filteredCars,
    sortedCars,
    totalPages,
    startIndex,
    endIndex,
    paginatedCars,
    handleCheckboxChange,
    handleSortChange,
    handlePriceRangeChange,
    handleItemsPerPageChange,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    handleClearFilters,
    startItemIndex,
    endItemIndex,
  } = useCarFilter(carsData);

  // Mobile filter drawer state
  const {
    isOpen: isMobileFilterOpen,
    onOpen: openMobileFilter,
    onClose: closeMobileFilter
  } = useDisclosure();

  // Desktop filter sidebar state
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Responsive values
  const sidebarWidth = "320px";
  const maxContentWidth = "1400px"; // Maximum width

  const { data, isLoading } = usePriceRange();

  if (isLoading) return <CarListSkeleton />;
  if (!data) return null;

  const { min_price, max_price } = data;

  // Generate price options (e.g., every 1,000 euros)
  const step = 1000;
  const priceOptions = [];
  for (let price = min_price; price <= max_price; price += step) {
    priceOptions.push(price);
  }

  return (
    <Layout footerStyle={1}>
      <section className="background-body ">
        <Container maxWidth={maxContentWidth} mx="auto">
          <Flex direction={{ base: 'column', md: 'row' }} className="" width="100%">
            {/* Filter sidebar - desktop */}
            <Box
              className="order-lg-first"
              display={{ base: 'none', md: isFilterOpen ? 'block' : 'none' }}
              width={isFilterOpen ? sidebarWidth : "0"}
              minWidth={isFilterOpen ? sidebarWidth : "0"}
              transition="all 0.3s ease-in-out"
              overflow="hidden"
              position="relative"
              flexShrink={0}
            >
              {isFilterOpen && (
                <CarFilterUI
                  isMobileOpen={false}
                  setIsMobileOpen={() => { }}
                />
              )}
            </Box>

            {/* Mobile Filter Drawer */}
            <Drawer
              isOpen={isMobileFilterOpen}
              placement="left"
              onClose={closeMobileFilter}
              size="xs"
            >
              <DrawerOverlay display={{ md: 'none' }} />
              <DrawerContent maxW={sidebarWidth} display={{ md: 'none' }}>
                <CarFilterUI
                  isMobileOpen={isMobileFilterOpen}
                  setIsMobileOpen={closeMobileFilter}
                />
              </DrawerContent>
            </Drawer>

            {/* Body - Full width on mobile, remaining space on desktop but with max width */}
            <Box
              className="content-right "
              flex="1"
              width="100%"
              transition="all 0.3s ease-in-out"
            >
              <Box px={{ base: 1, md: 3 }} py={{ base: 1, md: 6 }} width="100%">
                <Body
                  openMobileFilter={openMobileFilter}
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                />
              </Box>
            </Box>
          </Flex>
        </Container>

      </section>
    </Layout>
  );
}