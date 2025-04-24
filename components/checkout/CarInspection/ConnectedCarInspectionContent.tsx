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
    Icon,
    useColorModeValue,
    useBreakpointValue
} from '@chakra-ui/react';
import { ChevronDownIcon, InfoIcon } from '@chakra-ui/icons';

interface ConnectedCarInspectionContentProps {
    onComplete: () => void;
}

const ConnectedCarInspectionContent: React.FC<ConnectedCarInspectionContentProps> = ({ onComplete }) => {
    // Color mode values
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("#D3D3D3", "gray.600");
    const textColor = useColorModeValue("gray.700", "gray.300");
    const headingColor = useColorModeValue("gray.700", "white");
    const inputBgColor = useColorModeValue("white", "gray.700");
    const inputBorderColor = useColorModeValue("gray.200", "gray.600");
    const labelColor = useColorModeValue("gray.700", "gray.400");

    const redAccentColor = useColorModeValue("red.500", "red.400");
    const redAccentHoverColor = useColorModeValue("red.600", "red.300");
    const redLightBgColor = useColorModeValue("red.50", "red.900");
    const redTextColor = useColorModeValue("red.600", "red.300");
    const redTextDarkColor = useColorModeValue("red.800", "red.200");

    const grayBgColor = useColorModeValue("gray.100", "gray.700");
    const grayTextColor = useColorModeValue("gray.700", "gray.300");

    const errorColor = useColorModeValue("red.500", "red.300");
    const successColor = useColorModeValue("green.500", "green.300");

    const connectionLineColor = useColorModeValue("#FFA9A9", "#FF6B6B");
    const dividerColor = useColorModeValue("red.600", "red.400");

    // Additional color values for conditional usage
    const checkboxBorderUncheckedColor = useColorModeValue("gray.400", "gray.500");
    const noteBorderColor = useColorModeValue("red.100", "red.800");

    // Responsive values
    const isMobile = useBreakpointValue({ base: true, md: false });
    const formPadding = useBreakpointValue({ base: 4, md: 6 });
    const headingFontSize = useBreakpointValue({ base: "md", md: "lg" });
    const inputHeight = useBreakpointValue({ base: "44px", md: "40px" });
    const buttonSize = useBreakpointValue({ base: "md", md: "lg" });

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
                <Box bg={errorColor} borderRadius="full" w={isMobile ? "18px" : "20px"} h={isMobile ? "18px" : "20px"} display="flex" alignItems="center" justifyContent="center">
                    <Text color="white" fontSize="xs" fontWeight="bold">!</Text>
                </Box>
            </Box>
        ) : formData[field as keyof typeof formData] ? (
            <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
                <Box bg={successColor} borderRadius="full" w={isMobile ? "18px" : "20px"} h={isMobile ? "18px" : "20px"} display="flex" alignItems="center" justifyContent="center">
                    <Icon viewBox="0 0 24 24" color="white" boxSize={isMobile ? 2.5 : 3} aria-label="Icon">
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
        <Box
            position="relative"
            ml={{ base: 6, md: 14 }}
            mt={4}
            border='1px solid'
            borderColor={borderColor}
            borderRadius='lg'
            maxW={{ base: "calc(100vw - 50px)", md: "100%" }}
        >
            <Box position="absolute" top="-36px" left={{ base: "-25px", md: "-40px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={isMobile ? "70" : "100"} height={isMobile ? "70" : "100"}>
                    <path d="M20,20 L20,80 C20,86.6 25.4,92 32,92 L40,92" stroke={connectionLineColor} strokeWidth="2" fill="none" />
                </svg>
            </Box>

            <Box bg={bgColor} borderRadius="md" overflow="hidden" borderWidth="1px" borderColor={borderColor} boxShadow="sm">
                <Box py={4} px={formPadding} borderBottomWidth="1px" borderColor={borderColor}>
                    <Text fontSize={headingFontSize} fontWeight="bold" color={headingColor}>Personal information</Text>
                </Box>

                {/* Account type toggle */}
                <Flex borderRadius="md" overflow="hidden" mx={formPadding} mt={4}>
                    <Box
                        flex={1} py={3}
                        bg={accountType === 'consumer' ? redAccentColor : grayBgColor}
                        color={accountType === 'consumer' ? "white" : grayTextColor}
                        textAlign="center" fontWeight={accountType === 'consumer' ? "bold" : "normal"}
                        cursor="pointer" onClick={() => handleAccountTypeChange('consumer')}
                        borderLeftRadius="md"
                        fontSize={{ base: "sm", md: "md" }}
                    >
                        Consumer
                    </Box>
                    <Box
                        flex={1} py={3}
                        bg={accountType === 'company' ? redAccentColor : grayBgColor}
                        color={accountType === 'company' ? "white" : grayTextColor}
                        textAlign="center" fontWeight={accountType === 'company' ? "bold" : "normal"}
                        cursor="pointer" onClick={() => handleAccountTypeChange('company')}
                        borderRightRadius="md"
                        fontSize={{ base: "sm", md: "md" }}
                    >
                        Company
                    </Box>
                </Flex>

                {/* Form content */}
                <Box p={formPadding}>
                    {/* VAT Payer Checkbox */}
                    {accountType === 'company' && (
                        <Box mb={6}>
                            <Checkbox
                                isChecked={isVatPayer}
                                onChange={(e) => setIsVatPayer(e.target.checked)}
                                colorScheme="red"
                                size={isMobile ? "sm" : "md"}
                                sx={{
                                    '.chakra-checkbox__control': {
                                        borderColor: isVatPayer ? redAccentColor : checkboxBorderUncheckedColor,
                                        backgroundColor: isVatPayer ? redAccentColor : 'transparent',
                                    },
                                }}
                            >
                                <Text ml={2} fontSize={isMobile ? "sm" : "md"} color={textColor}>
                                    I'm a VAT payer
                                </Text>
                            </Checkbox>
                        </Box>
                    )}

                    {/* Company fields */}
                    {accountType === 'company' && (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} mb={6}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>COMPANY ID</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.companyId}
                                        onChange={handleChange('companyId')}
                                        placeholder="Company ID"
                                        borderColor={touched.companyId && errors.companyId ? errorColor : inputBorderColor}
                                        borderRadius="md" height={inputHeight}
                                        bg={inputBgColor}
                                        color={textColor}
                                        fontSize={isMobile ? "sm" : "md"}
                                    />
                                    <FieldIcon field="companyId" />
                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>COMPANY NAME</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.companyName}
                                        onChange={handleChange('companyName')}
                                        placeholder="Company name"
                                        borderColor={touched.companyName && errors.companyName ? errorColor : inputBorderColor}
                                        borderRadius="md" height={inputHeight}
                                        bg={inputBgColor}
                                        color={textColor}
                                        fontSize={isMobile ? "sm" : "md"}
                                    />
                                    <FieldIcon field="companyName" />
                                </Box>
                            </FormControl>
                        </SimpleGrid>
                    )}

                    {/* Personal Information Fields */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
                        <FormControl>
                            <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>NAME</FormLabel>
                            <Box position="relative">
                                <Input
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    placeholder="Name"
                                    borderColor={touched.name && errors.name ? errorColor : inputBorderColor}
                                    borderRadius="md" height={inputHeight}
                                    bg={inputBgColor}
                                    color={textColor}
                                    fontSize={isMobile ? "sm" : "md"}
                                />
                                <FieldIcon field="name" />
                            </Box>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>SURNAME</FormLabel>
                            <Box position="relative">
                                <Input
                                    value={formData.surname}
                                    onChange={handleChange('surname')}
                                    placeholder="Surname"
                                    borderColor={touched.surname && errors.surname ? errorColor : inputBorderColor}
                                    borderRadius="md" height={inputHeight}
                                    bg={inputBgColor}
                                    color={textColor}
                                    fontSize={isMobile ? "sm" : "md"}
                                />
                                <FieldIcon field="surname" />
                            </Box>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>TELEPHONE NUMBER</FormLabel>
                            <Flex>
                                <Box width={{ base: "80px", md: "90px" }} mr={2}>
                                    <Flex
                                        borderWidth="1px"
                                        borderColor={inputBorderColor}
                                        borderRadius="md"
                                        alignItems="center"
                                        height={inputHeight}
                                        px={2}
                                        justifyContent="space-between"
                                        bg={inputBgColor}
                                        color={textColor}
                                    >
                                        <Flex alignItems="center">
                                            <Box as="span" width="24px" height="16px" bg="red.500" mr={1.5} borderRadius="sm" />
                                            <Text fontSize={isMobile ? "xs" : "sm"}>+39</Text>
                                        </Flex>
                                        <ChevronDownIcon boxSize={isMobile ? 3 : 4} />
                                    </Flex>
                                </Box>
                                <Box position="relative" flex="1">
                                    <Input
                                        value={formData.telephone}
                                        onChange={handleChange('telephone')}
                                        placeholder="Telephone number"
                                        borderColor={touched.telephone && errors.telephone ? errorColor : inputBorderColor}
                                        borderRadius="md" height={inputHeight}
                                        bg={inputBgColor}
                                        color={textColor}
                                        fontSize={isMobile ? "sm" : "md"}
                                    />
                                    <FieldIcon field="telephone" />
                                </Box>
                            </Flex>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>BIRTH DATE</FormLabel>
                            <Box position="relative">
                                <Input
                                    value={formData.birthDate}
                                    onChange={handleChange('birthDate')}
                                    placeholder="dd.mm.yyyy"
                                    borderColor={touched.birthDate && errors.birthDate ? errorColor : inputBorderColor}
                                    borderRadius="md" height={inputHeight}
                                    bg={inputBgColor}
                                    color={textColor}
                                    fontSize={isMobile ? "sm" : "md"}
                                />
                                <FieldIcon field="birthDate" />
                            </Box>
                        </FormControl>
                    </SimpleGrid>

                    {/* Billing Address Divider */}
                    <Box py={4} my={4} position="relative" display="flex" alignItems="center" width="100%" shadow="md">
                        <Box flex="1">
                            <Divider borderColor={dividerColor} />
                        </Box>
                        <Text fontSize={isMobile ? "sm" : "md"} fontWeight="600" color={redTextColor} mx={4}>
                            Billing address
                        </Text>
                        <Box flex="1">
                            <Divider borderColor={dividerColor} />
                        </Box>
                    </Box>

                    {/* Address Form */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 4 }} mb={6} >
                        <GridItem colSpan={{ base: 1, md: 1 }}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>STREET</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.street}
                                        onChange={handleChange('street')}
                                        placeholder="Street"
                                        borderColor={touched.street && errors.street ? errorColor : inputBorderColor}
                                        borderRadius="md" height={inputHeight}
                                        bg={inputBgColor}
                                        color={textColor}
                                        fontSize={isMobile ? "sm" : "md"}
                                    />
                                    <FieldIcon field="street" />
                                </Box>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{ base: 1, md: 1 }} >
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>HOUSE NUMBER</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.houseNumber}
                                        onChange={handleChange('houseNumber')}
                                        placeholder="House number"
                                        borderColor={touched.houseNumber && errors.houseNumber ? errorColor : inputBorderColor}
                                        borderRadius="md" height={inputHeight}
                                        bg={inputBgColor}
                                        color={textColor}
                                        fontSize={isMobile ? "sm" : "md"}
                                    />
                                    <FieldIcon field="houseNumber" />
                                </Box>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{ base: 1, md: 1 }}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>POSTAL CODE</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.postalCode}
                                        onChange={handleChange('postalCode')}
                                        placeholder="Postal code"
                                        borderColor={touched.postalCode && errors.postalCode ? errorColor : inputBorderColor}
                                        borderRadius="md" height={inputHeight}
                                        bg={inputBgColor}
                                        color={textColor}
                                        fontSize={isMobile ? "sm" : "md"}
                                    />
                                    <FieldIcon field="postalCode" />
                                </Box>
                            </FormControl>
                        </GridItem>
                    </SimpleGrid>

                    {/* City and Country */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 4 }} mb={6}>
                        <GridItem colSpan={{ base: 1, md: 1 }}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>CITY</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.city}
                                        onChange={handleChange('city')}
                                        placeholder="City"
                                        borderColor={touched.city && errors.city ? errorColor : inputBorderColor}
                                        borderRadius="md" height={inputHeight}
                                        bg={inputBgColor}
                                        color={textColor}
                                        fontSize={isMobile ? "sm" : "md"}
                                    />
                                    <FieldIcon field="city" />
                                </Box>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{ base: 1, md: 1 }}>
                            <FormControl>
                                <FormLabel fontSize="xs" fontWeight="bold" color={labelColor}>COUNTRY</FormLabel>
                                <Box position="relative">
                                    <Box
                                        borderWidth="1px"
                                        borderColor={inputBorderColor}
                                        borderRadius="md"
                                        height={inputHeight}
                                        display="flex"
                                        alignItems="center"
                                        px={3}
                                        justifyContent="space-between"
                                        cursor="not-allowed"
                                        bg={inputBgColor}
                                        color={textColor}
                                    >
                                        <Flex alignItems="center">
                                            <Box
                                                as="span"
                                                width={{ base: "22px", md: "24px" }}
                                                height={{ base: "14px", md: "16px" }}
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
                                            <Text fontSize={isMobile ? "sm" : "md"}>Italy</Text>
                                        </Flex>
                                        <ChevronDownIcon boxSize={isMobile ? 3 : 4} />
                                    </Box>
                                </Box>
                            </FormControl>
                        </GridItem>
                    </SimpleGrid>

                    {/* Info box about country */}
                    <Box bg={redLightBgColor} p={formPadding} borderRadius="md" mb={4} borderWidth="1px" borderColor={noteBorderColor}>
                        <Flex alignItems={isMobile ? "flex-start" : "center"}>
                            <Box mr={3} mt={isMobile ? "3px" : "2px"} flexShrink={0}>
                                <InfoIcon color={redAccentColor} boxSize={isMobile ? 4 : 5} />
                            </Box>
                            <Text fontSize={isMobile ? "xs" : "sm"} color={redTextDarkColor}>
                                You cannot change the country any longer. If you need to make a change, please get in touch with our support.
                            </Text>
                        </Flex>
                    </Box>

                    {/* Contact Address Section */}
                    <Box mt={6} mb={4}>
                        <Text fontSize={isMobile ? "sm" : "md"} fontWeight="bold" color={headingColor}>CONTACT ADDRESS</Text>
                        <Flex mt={2} alignItems="center">
                            <Checkbox
                                isChecked={sameContactAddress}
                                onChange={(e) => setSameContactAddress(e.target.checked)}
                                colorScheme="red"
                                size={isMobile ? "sm" : "md"}
                                iconColor="white"
                                sx={{
                                    '.chakra-checkbox__control': {
                                        borderColor: sameContactAddress ? redAccentColor : checkboxBorderUncheckedColor,
                                        backgroundColor: sameContactAddress ? redAccentColor : 'transparent',
                                    },
                                }}
                            >
                                <Text ml={2} fontSize={isMobile ? "sm" : "md"} color={redTextColor} fontWeight="medium">
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
                            bg={redAccentColor}
                            color="white"
                            size={buttonSize}
                            px={{ base: 8, md: 12 }}
                            shadow="md"
                            width={{ base: "100%", md: "auto" }}
                            _hover={{
                                bg: redAccentHoverColor,
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