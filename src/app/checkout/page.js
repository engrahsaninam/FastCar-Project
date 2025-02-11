"use client";
import React from 'react';
import PaymentMethod from './PaymentMethod';
import Purchaseinfo from './Purchaseinfo';
import CheckoutHeader from './CheckoutHeader';
import AppBar from '@/components/AppBar';
import PriceSummary from './pricesum';
import Footer from '@/components/HomePage/Footer';

const CheckoutPage = () => {
    const carData = {
        name: "BMW 320d Touring Advantage 140 kW",
        image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        mileage: "135,211",
        year: "12/2021",
        deliveryTime: 20
    };

    return (
        <div className="min-h-screen bg-[#F8F9FE]">
            <AppBar />
            <CheckoutHeader carData={carData} />
            
            {/* Mobile Price Summary */}
            <div className="block lg:hidden w-full">
                <PriceSummary />
            </div>

            <main className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-2 w-full">
                        <div className="px-0 sm:px-4 lg:px-6">
                            <Purchaseinfo />
                            <PaymentMethod />
                        </div>
                    </div>

                    {/* Desktop Price Summary */}
                    <div className="hidden lg:block lg:col-span-1">
                        <PriceSummary />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;