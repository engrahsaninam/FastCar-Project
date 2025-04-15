import React, { useState } from 'react';
import {
    Box,
    Text,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Button,
    Checkbox,
    Divider,
    SimpleGrid,
    GridItem,
    Icon
} from '@chakra-ui/react';
import { ChevronDownIcon, InfoIcon } from '@chakra-ui/icons';

interface ConnectedCarInspectionContentProps {
    onComplete: () => void;
}

const ConnectedCarInspectionContent: React.FC<ConnectedCarInspectionContentProps> = ({ onComplete }) => {
    // States
    const [accountType, setAccountType] = useState('consumer');
    const [isVatPayer, setIsVatPayer] = useState(false);
    const [formData, setFormData] = useState({
        // Company info
        companyId: '',
        companyName: '',
        // Personal info
        name: '',
        surname: '',
        telephone: '',
        birthDate: '',
        // Address info
        street: '',
        houseNumber: '',
        postalCode: '',
        city: '',
        country: 'Italy'
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [sameContactAddress, setSameContactAddress] = useState(true);

    // Field status icon component
    const FieldIcon = ({ field }: { field: string }) => {
        if (!touched[field]) return null;

        return errors[field] ? (
            <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
                <Box bg="red.500" borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
                    <Text color="white" fontSize="xs" fontWeight="bold">!</Text>
                </Box>
            </Box>
        ) : formData[field as keyof typeof formData] ? (
            <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
                <Box bg="green.500" borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
                    <Icon viewBox="0 0 24 24" color="white" boxSize={3} aria-label="Icon">
                        <path
                            fill="currentColor"
                            d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                        />
                    </Icon>
                </Box>
            </Box>
        ) : null;
    };

    // Handlers
    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value });
        setTouched({ ...touched, [field]: true });
    };

    const handleAccountTypeChange = (type: string) => {
        setAccountType(type);
    };

    return (
        <Box position="relative" ml={{ base: 10, md: 14 }} mt={4}>
            {/* Connection line */}
            <Box position="absolute" top="-36px" left="-40px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                    <path d="M20,20 L20,80 C20,86.6 25.4,92 32,92 L40,92" stroke="#FFA9A9" strokeWidth="2" fill="none" />
                </svg>
            </Box>

            {/* Main container */}
            <Box bg="white" borderRadius="md" overflow="hidden" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
                {/* Header */}
                <Box py={4} px={6} borderBottomWidth="1px" borderColor="gray.200">
                    <Text fontSize="lg" fontWeight="bold" color="gray.700">Billing address</Text>
                </Box>

                {/* Account type toggle */}
                <Flex borderRadius="md" overflow="hidden" mx={4} mt={4}>
                    <Box
                        flex={1} py={3}
                        bg={accountType === 'consumer' ? "red.500" : "gray.100"}
                        color={accountType === 'consumer' ? "white" : "gray.700"}
                        textAlign="center" fontWeight={accountType === 'consumer' ? "bold" : "normal"}
                        cursor="pointer" onClick={() => handleAccountTypeChange('consumer')}
                        borderLeftRadius="md"
                    >
                        Consumer
                    </Box>
                    <Box
                        flex={1} py={3}
                        bg={accountType === 'company' ? "red.500" : "gray.100"}
                        color={accountType === 'company' ? "white" : "gray.700"}
                        textAlign="center" fontWeight={accountType === 'company' ? "bold" : "normal"}
                        cursor="pointer" onClick={() => handleAccountTypeChange('company')}
                        borderRightRadius="md"
                    >
                        Company
                    </Box>
                </Flex>

                {/* Form content */}
                <Box p={6}>
                    {/* VAT Payer Checkbox */}
                    {accountType === 'company' && (
                        <Box mb={6}>
                            <Checkbox
                                isChecked={isVatPayer}
                                onChange={(e) => setIsVatPayer(e.target.checked)}
                                colorScheme="red"
                                size="md"
                            >
                                <Text ml={2} fontSize="md" color="gray.700">
                                    I'm a VAT payer
                                </Text>
                            </Checkbox>
                        </Box>
                    )}

                    {/* Company fields */}
                    {accountType === 'company' && (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">COMPANY ID</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.companyId}
                                        onChange={handleChange('companyId')}
                                        placeholder="Company ID"
                                        borderColor={touched.companyId && errors.companyId ? "red.500" : "gray.200"}
                                        borderRadius="md" height="40px"
                                    />
                                    <FieldIcon field="companyId" aria-label="Icon" />
                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">COMPANY NAME</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.companyName}
                                        onChange={handleChange('companyName')}
                                        placeholder="Company name"
                                        borderColor={touched.companyName && errors.companyName ? "red.500" : "gray.200"}
                                        borderRadius="md" height="40px"
                                    />
                                    <FieldIcon field="companyName" aria-label="Icon" />
                                </Box>
                            </FormControl>
                        </SimpleGrid>
                    )}

                    {/* Personal Information Fields */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl>
                            <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">NAME</FormLabel>
                            <Box position="relative">
                                <Input
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    placeholder="Name"
                                    borderColor={touched.name && errors.name ? "red.500" : "gray.200"}
                                    borderRadius="md" height="40px"
                                />
                                <FieldIcon field="name" aria-label="Icon" />
                            </Box>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">SURNAME</FormLabel>
                            <Box position="relative">
                                <Input
                                    value={formData.surname}
                                    onChange={handleChange('surname')}
                                    placeholder="Surname"
                                    borderColor={touched.surname && errors.surname ? "red.500" : "gray.200"}
                                    borderRadius="md" height="40px"
                                />
                                <FieldIcon field="surname" aria-label="Icon" />
                            </Box>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">TELEPHONE NUMBER</FormLabel>
                            <Flex>
                                <Box width="90px" mr={2}>
                                    <Flex
                                        borderWidth="1px"
                                        borderColor="gray.200"
                                        borderRadius="md"
                                        alignItems="center"
                                        height="40px"
                                        px={2}
                                        justifyContent="space-between"
                                    >
                                        <Flex alignItems="center">
                                            <Box as="span" width="24px" height="16px" bg="red.500" mr={1.5} borderRadius="sm" />
                                            <Text fontSize="sm">+39</Text>
                                        </Flex>
                                        <ChevronDownIcon />
                                    </Flex>
                                </Box>
                                <Box position="relative" flex="1">
                                    <Input
                                        value={formData.telephone}
                                        onChange={handleChange('telephone')}
                                        placeholder="Telephone number"
                                        borderColor={touched.telephone && errors.telephone ? "red.500" : "gray.200"}
                                        borderRadius="md" height="40px"
                                    />
                                    <FieldIcon field="telephone" aria-label="Icon" />
                                </Box>
                            </Flex>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">BIRTH DATE</FormLabel>
                            <Box position="relative">
                                <Input
                                    value={formData.birthDate}
                                    onChange={handleChange('birthDate')}
                                    placeholder="dd.mm.yyyy"
                                    borderColor={touched.birthDate && errors.birthDate ? "red.500" : "gray.200"}
                                    borderRadius="md" height="40px"
                                />
                                <FieldIcon field="birthDate" aria-label="Icon" />
                            </Box>
                        </FormControl>
                    </SimpleGrid>

                    {/* Billing Address Divider */}
                    <Box py={4} my={4} position="relative" display="flex" alignItems="center" width="100%" shadow="md">
                        <Box flex="1">
                            <Divider borderColor="red.600" />
                        </Box>
                        <Text fontSize="md" fontWeight="600" color="red.600" mx={4}>
                            Billing address
                        </Text>
                        <Box flex="1">
                            <Divider borderColor="red.600" />
                        </Box>
                    </Box>

                    {/* Address Form */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6} shadow="md">
                        <GridItem colSpan={{ md: 1 }}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">STREET</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.street}
                                        onChange={handleChange('street')}
                                        placeholder="Street"
                                        borderColor={touched.street && errors.street ? "red.500" : "gray.200"}
                                        borderRadius="md" height="40px"
                                    />
                                    <FieldIcon field="street" aria-label="Icon" />
                                </Box>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{ md: 1 }} shadow="md">
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">HOUSE NUMBER</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.houseNumber}
                                        onChange={handleChange('houseNumber')}
                                        placeholder="House number"
                                        borderColor={touched.houseNumber && errors.houseNumber ? "red.500" : "gray.200"}
                                        borderRadius="md" height="40px"
                                    />
                                    <FieldIcon field="houseNumber" aria-label="Icon" />
                                </Box>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{ md: 1 }}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">POSTAL CODE</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.postalCode}
                                        onChange={handleChange('postalCode')}
                                        placeholder="Postal code"
                                        borderColor={touched.postalCode && errors.postalCode ? "red.500" : "gray.200"}
                                        borderRadius="md" height="40px"
                                    />
                                    <FieldIcon field="postalCode" aria-label="Icon" />
                                </Box>
                            </FormControl>
                        </GridItem>
                    </SimpleGrid>

                    {/* City and Country */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                        <GridItem colSpan={{ md: 1 }}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">CITY</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.city}
                                        onChange={handleChange('city')}
                                        placeholder="City"
                                        borderColor={touched.city && errors.city ? "red.500" : "gray.200"}
                                        borderRadius="md" height="40px"
                                    />
                                    <FieldIcon field="city" aria-label="Icon" />
                                </Box>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{ md: 1 }}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">COUNTRY</FormLabel>
                                <Box position="relative">
                                    <Box
                                        borderWidth="1px"
                                        borderColor="gray.200"
                                        borderRadius="md"
                                        height="40px"
                                        display="flex"
                                        alignItems="center"
                                        px={3}
                                        justifyContent="space-between"
                                        cursor="not-allowed"
                                        bg="white"
                                    >
                                        <Flex alignItems="center">
                                            <Box
                                                as="span"
                                                width="24px"
                                                height="16px"
                                                mr={2}
                                                borderRadius="sm"
                                                position="relative"
                                                overflow="hidden"
                                                display="flex"
                                            >
                                                <Box as="span" width="33%" height="full" bg="green.500" />
                                                <Box as="span" width="34%" height="full" bg="white" />
                                                <Box as="span" width="33%" height="full" bg="red.500" />
                                            </Box>
                                            <Text>Italy</Text>
                                        </Flex>
                                        <ChevronDownIcon />
                                    </Box>
                                </Box>
                            </FormControl>
                        </GridItem>
                    </SimpleGrid>

                    {/* Info box about country */}
                    <Box bg="red.50" p={4} borderRadius="md" mb={4}>
                        <Flex>
                            <Box mr={3} mt="2px">
                                <InfoIcon color="red.500" boxSize={5} aria-label="Icon" />
                            </Box>
                            <Text fontSize="sm" color="red.800">
                                You cannot change the country any longer. If you need to make a change, please get in touch with our support.
                            </Text>
                        </Flex>
                    </Box>

                    {/* Contact Address Section */}
                    <Box mt={6} mb={4}>
                        <Text fontSize="md" fontWeight="bold" color="gray.700">CONTACT ADDRESS</Text>
                        <Flex mt={2} alignItems="center">
                            <Checkbox
                                isChecked={sameContactAddress}
                                onChange={(e) => setSameContactAddress(e.target.checked)}
                                colorScheme="red"
                                size="md"
                                iconColor="white"
                            >
                                <Text ml={2} fontSize="md" color="red.600" fontWeight="medium">
                                    Same as billing address
                                </Text>
                            </Checkbox>
                        </Flex>
                    </Box>

                    {/* Confirm Button */}
                    <Box display="flex" justifyContent="center" mt={6} mb={4}>
                        <Button
                            aria-label="Confirm the data"
                            type="submit"
                            colorScheme="red"
                            size="lg"
                            px={12}
                            shadow="md"
                            _hover={{
                                shadow: "lg",
                                transform: "translateY(-1px)"
                            }}
                            _active={{
                                shadow: "sm",
                                transform: "translateY(1px)"
                            }}
                            onClick={onComplete}
                        >
                            Confirm the data
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ConnectedCarInspectionContent; 