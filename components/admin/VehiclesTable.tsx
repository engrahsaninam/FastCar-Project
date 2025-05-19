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
    Button,
    HStack,
    IconButton,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Vehicle } from './types';

interface VehiclesTableProps {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicleId: number) => void;
    onViewServices: (vehicle: Vehicle) => void;
}

const VehiclesTable: React.FC<VehiclesTableProps> = ({
    vehicles,
    onEdit,
    onDelete,
    onViewServices,
}) => {
    return (
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th color="gray.600">Vehicle</Th>
                        <Th color="gray.600">Base Price</Th>
                        <Th color="gray.600">Price Without VAT</Th>
                        <Th color="gray.600">Services</Th>
                        <Th color="gray.600">Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {vehicles.map((vehicle) => (
                        <Tr key={vehicle.id}>
                            <Td>
                                <Text fontWeight="medium" color="gray.800">{vehicle.name}</Text>
                                <Text fontSize="sm" color="gray.500">{vehicle.power}</Text>
                            </Td>
                            <Td color="gray.800">CZK {vehicle.basePrice.toLocaleString()}</Td>
                            <Td color="gray.800">CZK {vehicle.priceWithoutVAT.toLocaleString()}</Td>
                            <Td>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => onViewServices(vehicle)}
                                >
                                    View Services
                                </Button>
                            </Td>
                            <Td>
                                <HStack spacing={2}>
                                    <IconButton
                                        aria-label="Edit vehicle"
                                        icon={<FiEdit2 />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onEdit(vehicle)}
                                    />
                                    <IconButton
                                        aria-label="Delete vehicle"
                                        icon={<FiTrash2 />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => onDelete(vehicle.id)}
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

export default VehiclesTable; 