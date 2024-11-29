"use client"
import Navbar from "@/components/AppBar";
import CarBudgetSelector from "@/components/HomePage/Budget";
import CarListings from "@/components/HomePage/CarList";
import CarValuationForm from "@/components/HomePage/CarValuation";
import Footer from "@/components/HomePage/Footer";
import HeroSection from "@/components/HomePage/Header";
import CarBuyingProcess from "@/components/HomePage/Proccess";
import TestimonialsSection from "@/components/HomePage/Reviews";
import SafePurchaseSection from "@/components/HomePage/SafePurchaseSection";
import CarBuy from "@/components/HomePage/ShopCar";
import TrendingSearches from "@/components/HomePage/Trending";
import WhyChooseUs from "@/components/HomePage/WhyUs";

export default function Home() {
  return (
   <>
    <Navbar/>
    <HeroSection/>
    <SafePurchaseSection/>
    {/* <TrendingSearches /> */}
    <CarListings />
    <CarBuyingProcess/>
    <CarBuy/>
    <WhyChooseUs/>
    <CarBudgetSelector/>
    <TestimonialsSection/>
    <CarValuationForm/>
    <Footer/>
   </>
  );
}
