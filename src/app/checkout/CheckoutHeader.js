"use client";

import React from 'react';
import { ChevronLeft, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const CheckoutHeader = ({ carData }) => {
    const router = useRouter();

    const handleStepClick = (stepId) => {
        const element = document.getElementById(stepId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const steps = [
        { number: 1, label: 'Payment method', id: 'payment-method' },
        { number: 2, label: 'Car condition check', id: 'car-condition' },
        { number: 3, label: 'Delivery', id: 'delivery' },
        { number: 4, label: 'Payment', id: 'payment' }
    ];

    return (
        <div className="w-full">
            {/* Upper Header */}
            <div className="border-b bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                        {/* Left side with back button and logo */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button 
                                onClick={() => router.back()}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <Link href="/" className="text-red-500 hover:text-red-700">Fast.</Link>
                        </div>

                        {/* Right side with contact info */}
                        <div className="flex items-center w-full sm:w-auto">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-red-50 rounded-lg p-3 sm:p-4 w-full sm:w-auto">
                                <div>
                                    <div className="text-sm text-gray-600">Do you need advice?</div>
                                    <a href="tel:+420246034700" className="text-red-500 font-medium">+420 246 034 700</a>
                                </div>
                                <div className="text-sm text-gray-500">Mo–Su 8 am-8 pm</div>
                            </div>
                        </div>
                    </div>

                    {/* Car Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4">
                        <div className="relative w-full sm:w-32 h-48 sm:h-20 rounded-lg overflow-hidden">
                            <img 
                                src={carData?.image}
                                alt={carData?.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="w-full">
                            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2 sm:mb-1">
                                <span>Buy a car</span>
                                <ChevronLeft className="h-4 w-4 mx-1" />
                                <span className="font-medium text-gray-900">{carData?.name}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                                <span>{carData?.mileage} km</span>
                                <span>{carData?.year}</span>
                                <div className="flex flex-wrap">
                                    <span className="text-gray-400">The usual delivery time is </span>
                                    <span className="mx-1">{carData?.deliveryTime} working days. </span>
                                    <span className="text-gray-400">We will let you know the exact date during the order process.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border-b overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4 sm:gap-8 min-w-max">
                        {steps.map((step, index) => (
                            <button 
                                key={step.number}
                                onClick={() => handleStepClick(step.id)}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <div className={`flex items-center justify-center w-6 sm:w-8 h-6 sm:h-8 rounded-full border-2 
                                    ${index === 0 ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 text-gray-400'}`}>
                                    {step.number}
                                </div>
                                <span className={`font-medium text-sm sm:text-base ${index === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutHeader;