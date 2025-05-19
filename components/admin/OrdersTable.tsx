import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Badge,
    HStack,
    IconButton,
} from '@chakra-ui/react';
import { FiEye, FiRefreshCw, FiX } from 'react-icons/fi';
import { Order } from './types';

interface OrdersTableProps {
    orders: Order[];
    onViewDetails: (order: Order) => void;
    onUpdateStatus: (orderId: string, status: string) => void;
    onCancel: (orderId: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
    orders,
    onViewDetails,
    onUpdateStatus,
    onCancel,
}) => {
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
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th color="gray.600">Order ID</Th>
                        <Th color="gray.600">Vehicle</Th>
                        <Th color="gray.600">Customer</Th>
                        <Th color="gray.600">Total Price</Th>
                        <Th color="gray.600">Status</Th>
                        <Th color="gray.600">Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {orders.map((order) => (
                        <Tr key={order.id}>
                            <Td>
                                <Text fontWeight="medium" color="gray.800">{order.id}</Text>
                                <Text fontSize="sm" color="gray.500">{order.date}</Text>
                            </Td>
                            <Td color="gray.800">{order.vehicle}</Td>
                            <Td>
                                <Text color="gray.800">{order.customer}</Text>
                                <Text fontSize="sm" color="gray.500">{order.customerEmail}</Text>
                            </Td>
                            <Td color="gray.800">CZK {order.totalPrice.toLocaleString()}</Td>
                            <Td>
                                <Badge colorScheme={getStatusColor(order.status)}>
                                    {order.status}
                                </Badge>
                            </Td>
                            <Td>
                                <HStack spacing={2}>
                                    <IconButton
                                        aria-label="View order details"
                                        icon={<FiEye />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onViewDetails(order)}
                                    />
                                    <IconButton
                                        aria-label="Update order status"
                                        icon={<FiRefreshCw />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onUpdateStatus(order.id, 'Processing')}
                                    />
                                    <IconButton
                                        aria-label="Cancel order"
                                        icon={<FiX />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => onCancel(order.id)}
                                    />
                                </HStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default OrdersTable; 