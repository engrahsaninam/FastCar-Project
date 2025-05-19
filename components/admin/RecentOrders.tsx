import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Text,
} from '@chakra-ui/react';
import { Order } from './types';

interface RecentOrdersProps {
    orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'yellow';
            case 'processing':
                return 'blue';
            case 'completed':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Text fontSize="lg" fontWeight="bold" mb={4}>Recent Orders</Text>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th color="gray.600">Order ID</Th>
                        <Th color="gray.600">Customer</Th>
                        <Th color="gray.600">Status</Th>
                        <Th color="gray.600">Amount</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {orders.map((order) => (
                        <Tr key={order.id}>
                            <Td color="gray.800">{order.id}</Td>
                            <Td color="gray.800">{order.customer}</Td>
                            <Td>
                                <Badge colorScheme={getStatusColor(order.status)}>
                                    {order.status}
                                </Badge>
                            </Td>
                            <Td color="gray.800">CZK {order.totalPrice.toLocaleString()}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default RecentOrders; 