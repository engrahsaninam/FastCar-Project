import React from 'react';
import {
    Grid,
    GridItem,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Box,
} from '@chakra-ui/react';
import { Stats } from './types';

interface DashboardOverviewProps {
    stats: Stats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            <GridItem>
                <Stat bg="white" p={6} borderRadius="lg" shadow="sm">
                    <StatLabel color="gray.800">Total Vehicles</StatLabel>
                    <StatNumber color="gray.800">{stats.totalVehicles.toLocaleString()}</StatNumber>
                    <StatHelpText color="gray.800">
                        <StatArrow type="increase" />
                        23.36%
                    </StatHelpText>
                </Stat>
            </GridItem>
            <GridItem>
                <Stat bg="white" p={6} borderRadius="lg" shadow="sm">
                    <StatLabel color="gray.800">Active Orders</StatLabel>
                    <StatNumber color="gray.800">{stats.activeOrders}</StatNumber>
                    <StatHelpText color="gray.800">
                        <StatArrow type="increase" />
                        9.05%
                    </StatHelpText>
                </Stat>
            </GridItem>
            <GridItem>
                <Stat bg="white" p={6} borderRadius="lg" shadow="sm">
                    <StatLabel color="gray.800">Total Revenue</StatLabel>
                    <StatNumber color="gray.800">CZK {stats.totalRevenue.toLocaleString()}</StatNumber>
                    <StatHelpText color="gray.800">
                        <StatArrow type="increase" />
                        12.5%
                    </StatHelpText>
                </Stat>
            </GridItem>
            <GridItem>
                <Stat bg="white" p={6} borderRadius="lg" shadow="sm">
                    <StatLabel color="gray.800">Pending Deliveries</StatLabel>
                    <StatNumber color="gray.800">{stats.pendingDeliveries}</StatNumber>
                    <StatHelpText color="gray.800">
                        <StatArrow type="decrease" />
                        2.5%
                    </StatHelpText>
                </Stat>
            </GridItem>
        </Grid>
    );
};

export default DashboardOverview; 