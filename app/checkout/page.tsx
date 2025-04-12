'use client'
import CheckoutCarDetails from '@/components/checkout/CheckoutCarDetails'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import React from 'react'
import { Box } from '@chakra-ui/react';
import PriceSummaryContent from '@/components/checkout/PriceSummaryContent';
import PriceSumMain from '@/components/checkout/PriceSumMain';

const page = () => {
    return (
        <div>
            <CheckoutCarDetails />
            <CheckoutSteps />
            <PriceSumMain />
        </div>
    )
}

export default page
