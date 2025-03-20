"use client"
import React, { useState } from 'react';
import { Car, Plus, Clock, Calendar, Euro, PhoneCall, ChevronLeft } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

const OrdersInProgress = () => {
    // Toggle this to false to see empty state
    const hasOrders = true;
    const totalOffers = "1 139 268";

    // Dummy orders data
    const orders = [
        {
            id: "ORD-2024-001",
            car: "BMW 3 Series 320d",
            price: "€32,500",
            status: "Documentation",
            eta: "March 15, 2024",
            lastUpdate: "2 hours ago",
            contact: "+1 234 567 890",
            year: "2023",
            mileage: "15,000 km",
            transmission: "Automatic",
            fuel: "Diesel",
            image: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym13fGVufDB8fDB8fHww"
        },
        {
            id: "ORD-2024-002",
            car: "Mercedes-Benz C-Class C200",
            price: "€38,900",
            status: "Transport",
            eta: "March 20, 2024",
            lastUpdate: "5 hours ago",
            contact: "+1 234 567 890",
            year: "2023",
            mileage: "12,000 km",
            transmission: "Automatic",
            fuel: "Petrol",
            image: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym13fGVufDB8fDB8fHww"
        },
        {
            id: "ORD-2024-003",
            car: "Audi A4 40 TFSI",
            price: "€35,750",
            status: "Payment Processing",
            eta: "March 18, 2024",
            lastUpdate: "1 day ago",
            contact: "+1 234 567 890",
            year: "2023",
            mileage: "18,000 km",
            transmission: "Automatic",
            fuel: "Petrol",
            image: "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym13fGVufDB8fDB8fHww"
        }
    ];

    const getStatusPercentage = (status) => {
        switch (status) {
            case 'Documentation': return 33;
            case 'Transport': return 66;
            case 'Payment Processing': return 90;
            default: return 100;
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
                {/* Header with Back Button */}
                <div className="flex items-center mb-6">
                    <Link href="/dashboard" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Orders in progress
                    </h1>
                </div>

                {/* Main Content */}
                {hasOrders ? (
                    <div className="space-y-4 mb-12">
                        {orders.map((order) => (
                            <div 
                                key={order.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Car Image Section */}
                                    <div className="md:w-1/3 relative">
                                        <div className="relative h-64 md:h-full min-h-[250px]">
                                            <Image
                                                src={order.image}
                                                alt={order.car}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    </div>

                                    {/* Order Details Section */}
                                    <div className="flex-1 p-6">
                                        {/* Header with Order ID and Price */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-500">Order ID: {order.id}</span>
                                            <span className="text-lg font-semibold text-red-500">
                                                {order.price}
                                            </span>
                                        </div>

                                        {/* Car Name and Basic Info */}
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            {order.car}
                                        </h3>

                                        {/* Car Specifications */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div>
                                                <div className="text-sm text-gray-500">Year</div>
                                                <div className="font-medium text-gray-800">{order.year}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Mileage</div>
                                                <div className="font-medium text-gray-800">{order.mileage}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Transmission</div>
                                                <div className="font-medium text-gray-800">{order.transmission}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Fuel</div>
                                                <div className="font-medium text-gray-800">{order.fuel}</div>
                                            </div>
                                        </div>

                                        {/* Order Status Details */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div>
                                                <div className="text-sm text-gray-500">Status</div>
                                                <div className="font-medium text-gray-800">{order.status}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">ETA</div>
                                                <div className="font-medium text-gray-800">{order.eta}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Last Update</div>
                                                <div className="font-medium text-gray-800">{order.lastUpdate}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Contact</div>
                                                <div className="font-medium text-gray-800">{order.contact}</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-6">
                                            <div className="h-2 bg-gray-100 rounded-full">
                                                <div 
                                                    className="h-2 bg-red-500 rounded-full transition-all duration-300"
                                                    style={{ width: `${getStatusPercentage(order.status)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end space-x-3">
                                            <Link href="/cars/car">
                                            <button className="px-4 py-2 text-sm text-red-500 hover:text-red-600 font-medium">
                                                View Details
                                            </button>
                                            </Link>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center mb-12">
                        <div className="relative w-48 h-32 mb-6">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Car size={120} className="text-red-500/20" />
                                <Plus size={24} className="text-red-500/40 absolute -top-4 -left-4" />
                                <Plus size={24} className="text-red-500/40 absolute -bottom-4 -right-4" />
                            </div>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Here you will see cars in transaction process.
                        </p>

                        <div className="w-full max-w-sm">
                            <Link href="/cars">
                                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg transition-colors">
                                    {totalOffers} Offers
                                </button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Categories Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Popular Categories */}
                    <div>
                        <h2 className="font-semibold text-gray-800 mb-4">Popular categories</h2>
                        <div className="space-y-2">
                            <CategoryLink label="SUV" count="234,567" />
                            <CategoryLink label="Estate" count="123,456" />
                            <CategoryLink label="Luxury" count="45,678" />
                            <CategoryLink label="Sport" count="78,901" />
                        </div>
                    </div>

                    {/* Selected Makes */}
                    <div>
                        <h2 className="font-semibold text-gray-800 mb-4">Selected makes</h2>
                        <div className="space-y-2">
                            <CategoryLink label="Volkswagen" count="98,765" />
                            <CategoryLink label="BMW" count="87,654" />
                            <CategoryLink label="Mercedes-Benz" count="76,543" />
                            <CategoryLink label="Audi" count="65,432" />
                        </div>
                    </div>

                    {/* Selected Models */}
                    <div>
                        <h2 className="font-semibold text-gray-800 mb-4">Selected models</h2>
                        <div className="space-y-2">
                            <CategoryLink label="Golf" count="54,321" />
                            <CategoryLink label="3 Series" count="43,210" />
                            <CategoryLink label="A4" count="32,109" />
                            <CategoryLink label="C-Class" count="21,098" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategoryLink = ({ label, count }) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <span className="text-gray-600 group-hover:text-red-500 transition-colors">
            {label}
        </span>
        <span className="text-gray-400 text-sm">
            {count}
        </span>
    </div>
);

export default OrdersInProgress;