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
} from '@chakra-ui/react';

interface FinancingEntry {
    name: string;
    surname: string;
    telephoneNumber: string;
    email: string;
    identificationNumber: string;
    dateOfBirth: string;
    totalFinancedAmount: number;
    totalKm: number;
    color: string;
}

interface FinancingTableProps {
    data: FinancingEntry[];
    onRowClick: (application: FinancingEntry) => void;
}

const FinancingTable: React.FC<FinancingTableProps> = ({ data, onRowClick }) => {
    return (
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Text fontSize="lg" fontWeight="bold" mb={4} color="black">Financing Applications</Text>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th color="gray.600">Name</Th>
                        <Th color="gray.600">Surname</Th>
                        <Th color="gray.600">Telephone Number</Th>
                        <Th color="gray.600">Email</Th>
                        <Th color="gray.600">Identification Number (DNI/NIE)</Th>
                        <Th color="gray.600">Date of Birth</Th>
                        <Th color='gray.600'>Total Amount </Th>
                        <Th color='gray.600'>Total Kiometers </Th>
                        <Th color='gray.600'>Color </Th>


                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((entry, index) => (
                        <Tr key={index} onClick={() => onRowClick(entry)} _hover={{ bg: 'gray.100', cursor: 'pointer' }}>
                            <Td color="gray.800">{entry.name}</Td>
                            <Td color="gray.800">{entry.surname}</Td>
                            <Td color="gray.800">{entry.telephoneNumber}</Td>
                            <Td color="gray.800">{entry.email}</Td>
                            <Td color="gray.800">{entry.identificationNumber}</Td>
                            <Td color="gray.800">{entry.dateOfBirth}</Td>
                            <Td color="gray.800">{entry.totalFinancedAmount}</Td>
                            <Td color="gray.800">{entry.totalKm}</Td>
                            <Td color="gray.800">{entry.color}</Td>

                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default FinancingTable; 