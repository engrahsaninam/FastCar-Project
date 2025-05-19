import React from 'react';
import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Grid,
    GridItem,
} from '@chakra-ui/react';
import { FinancingEntry } from './types'; // Assuming FinancingEntry is defined in types.ts

interface FinancingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: FinancingEntry | null;
    onApprove: (applicationId: string) => void;
    onReject: (applicationId: string) => void;
}

const FinancingDetailsModal: React.FC<FinancingDetailsModalProps> = ({
    isOpen,
    onClose,
    application,
    onApprove,
    onReject,
}) => {
    if (!application) return null; // Don't render if no application is selected

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Financing Application Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                            <GridItem>
                                <Text fontSize="sm" color="gray.500">Name</Text>
                                <Text fontWeight="medium" color="gray.800">{application.name}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm" color="gray.500">Surname</Text>
                                <Text fontWeight="medium" color="gray.800">{application.surname}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm" color="gray.500">Telephone Number</Text>
                                <Text fontWeight="medium" color="gray.800">{application.telephoneNumber}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm" color="gray.500">Email</Text>
                                <Text fontWeight="medium" color="gray.800">{application.email}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm" color="gray.500">Identification Number (DNI/NIE)</Text>
                                <Text fontWeight="medium" color="gray.800">{application.identificationNumber}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm" color="gray.500">Date of Birth</Text>
                                <Text fontWeight="medium" color="gray.800">{application.dateOfBirth}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm" color="gray.500">Total Amount to be Financed</Text>
                                <Text fontWeight="medium" color="gray.800">{application.totalFinancedAmount}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm" color="gray.500">Total Kilometers</Text>
                                <Text fontWeight="medium" color="gray.800">{application.totalKm}</Text>
                            </GridItem>
                            <GridItem>
                                <Text fontSize="sm" color="gray.500">Color of vehicle</Text>
                                <Text fontWeight="medium" color="gray.800">{application.color}</Text>
                            </GridItem>
                        </Grid>

                        <HStack justify="flex-end" spacing={3} mt={6}>
                            <Button colorScheme="green" onClick={() => onApprove(application.identificationNumber)}>
                                Approve
                            </Button>
                            <Button colorScheme="red" onClick={() => onReject(application.identificationNumber)}>
                                Reject
                            </Button>
                        </HStack>
                        {/* <HStack justify="flex-end" spacing={3} mt={6}>
                            <Button colorScheme="green" onClick={() => onApprove(application.totalFinancedAmount)}>
                                Approve
                            </Button>
                            <Button colorScheme="red" onClick={() => onReject(application.totalKm)}>
                                Reject
                            </Button>
                        </HStack>
                        <HStack justify="flex-end" spacing={3} mt={6}>
                            <Button colorScheme="green" onClick={() => onApprove(application.color)}>
                                Approve
                            </Button>

                        </HStack> */}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default FinancingDetailsModal; 