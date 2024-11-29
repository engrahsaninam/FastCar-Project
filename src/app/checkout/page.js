
"use client";

import React from 'react';



import PaymentMethod from './PaymentMethod';
import Purchaseinfo from './Purchaseinfo';

import CheckoutHeader from './CheckoutHeader';
import AppBar from '@/components/AppBar2';
import PriceSummary from './pricesum';
import Footer from '@/components/HomePage/Footer';

const CheckoutPage = () => {
    const carData = {
        name: "BMW 320d Touring Advantage 140 kW",
        image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lcmNlZGVzJTIwZTUzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", // Replace with your image path
        mileage: "135,211",
        year: "12/2021",
        deliveryTime: 20
    };
    

    

    return (
        <div className="min-h-screen bg-gray-50">
            <AppBar />
            <CheckoutHeader carData={carData} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="col-span-2">
                        <Purchaseinfo />
                        <PaymentMethod />
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-1">
                    <PriceSummary/>

                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default CheckoutPage;