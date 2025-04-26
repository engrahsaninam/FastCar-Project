'use client'
import CheckoutCarDetails from '@/components/checkout/CheckoutCarDetails'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import React from 'react'
import { Box } from '@chakra-ui/react';
import PriceSummaryContent from '@/components/checkout/PriceSummaryContent';
import PriceSumMain from '@/components/checkout/PriceSumMain';
import { Grid, GridItem } from '@chakra-ui/react';
import CheckoutPurchaseGuide from '@/components/checkout/CheckoutPurchaseGuide';
import StepOneContent from '@/components/checkout/StepOneContent';
import StepContent from '@/components/checkout/Common/StepContent';
import PriceSummary from '@/components/checkout/PriceSummary/PriceSummary';

const page = () => {
    return (
        <div className=''>
            <CheckoutCarDetails />
            <CheckoutSteps />
            <Box w="full" maxW="7xl" mx="auto">
                <Grid
                    templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
                    gap={{ base: 0, lg: 8 }}
                >
                    {/* Main Content */}
                    <GridItem colSpan={1} w="full">
                        <Box px={{ base: 0, sm: 4, lg: 6 }}>
                            <CheckoutPurchaseGuide />
                            <StepOneContent />
                        </Box>
                    </GridItem>

                    {/* Desktop Price Summary (hidden on mobile) */}
                    <GridItem
                        colSpan={1}
                        display={{ base: 'none', lg: 'block' }}
                    >
                        <PriceSummary />
                    </GridItem>
                </Grid>
            </Box>
            <Box display={{ base: 'block', md: 'none' }}>
                <PriceSummary />
            </Box>
        </div>
    )
}

export default page
