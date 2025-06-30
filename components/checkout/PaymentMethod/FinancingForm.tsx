import React, { useState } from 'react';
// import { useApplyFinance } from '@/services/cars/useCars';
import {
    Box,
    Text,
    Flex,
    Input,
    Button,
    FormControl,
    FormLabel,
    Checkbox,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useColorModeValue
} from '@chakra-ui/react';
import { Check, Info, Mail } from 'lucide-react';
import { useApplyFinance } from '@/services/cars/useCars'; // adjust path as needed
import { useSearchParams } from 'next/navigation';

interface FormData {
    name: string;
    surname: string;
    telephone_number: string;
    email: string;
    identification_number: string;
    date_of_birth: string;
}

interface FormErrors {
    name?: string;
    surname?: string;
    telephone_number?: string;
    email?: string;
    identification_number?: string;
    date_of_birth?: string;
}

interface TouchedFields {
    name?: boolean;
    surname?: boolean;
    telephone_number?: boolean;
    email?: boolean;
    identification_number?: boolean;
    date_of_birth?: boolean;
}

interface FinancingFormProps {
    onSubmit: () => void;
    // onDecline: () => void;
}

const FinancingForm: React.FC<FinancingFormProps> = ({ onSubmit }) => {
    // Color mode values
    const colors = {
        connectionLine: useColorModeValue("#FFA9A9", "#FF6B6B"),
        cardBackground: useColorModeValue("white", "gray.800"),
        headerTextColor: useColorModeValue("#2E3A59", "white"),
        noticeBackground: useColorModeValue("#FCF8F8FF", "gray.700"),
        borderColor: useColorModeValue("#EDF2F7", "gray.600"),
        textColor: useColorModeValue("#4A5568", "gray.300"),
        infoIconColor: useColorModeValue("#CE3131FF", "red.300"),
        iconBackground: useColorModeValue("#FBE6E6FF", "red.900"),
        footerTextColor: useColorModeValue("#718096", "gray.400"),
        checkIconColor: useColorModeValue("#CE3131FF", "red.300"),
        errorColor: useColorModeValue("#E53E3E", "red.300"),
        validColor: useColorModeValue("#38A169", "green.400"),
        successBackground: useColorModeValue("#F0FFF4", "green.900"),
        infoBackground: useColorModeValue("#FFEBEBFF", "red.900"),
        primaryButtonBg: useColorModeValue("#DD4C4CFF", "red.500"),
        primaryButtonHoverBg: useColorModeValue("#B93A3AFF", "red.600"),
        sentButtonBg: useColorModeValue("#CBD5E0", "gray.600")
    };

    const data = {
        header: { title: "Information about financing" },
        content: { description: "We need a few more details from you to establish the exact instalment amount and to check whether the provider will approve your application. It will only take you a few minutes to complete the form." },
        notice: {
            title: "You should know...",
            description: "Before you fill in your details, please read the information below carefully. Before you enter into a financing agreement, the correctness of the data will need to be verified. Usually, the following must be submitted with an application:",
            footer: "Additional documents or certificates may be required in rare cases. We will inform you about the specific terms before you place an order for a car."
        },
        thanks: {
            title: "Thank you for completing the form",
            description: "Do not forget to give us your consent before submitting it, so that we can pass your data onto the provider."
        },
        info: {
            title: "On business days (9 a.m. – 6 p.m.), we are usually able to obtain approval within 30 minutes.",
            description: "It is entirely up to you to decide whether you will take advantage of the financing; you can decide after receiving information about approval."
        },
        consent: {
            text: "I agree with the processing of the personal data for the purpose of arranging financing at licensed finance provider."
        },
        buttons: {
            check: "Submit your details",
            // decline: "Thank you, I'm not interested anymore",
            sent: "Application sent"
        },
        requirements: {
            primary: [
                "an identification document",
                "a health insurance card",
                "if you are an employee - your latest wage payment slip",
                "if you are a pensioner - \"certificazione UNICA 2021 od ultimo cedolino pensione od estratto conto con ultimo accredito o modello Unico con INVIO telematico o Modello 730\"",
                "if you are a sole proprietor - \"modello UNICO 2021 con ricevuta di presentazione di invio telematico\" and driver's licence"
            ],
        }
    };

    const [formData, setFormData] = useState<FormData>({
        
        name: '',
        surname: '',
        telephone_number: '',
        email: '',
        identification_number: '',
        date_of_birth: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        name: undefined,
        surname: undefined,
        telephone_number: undefined,
        email: undefined,
        identification_number: undefined,
        date_of_birth: undefined
    });

    const [touched, setTouched] = useState<TouchedFields>({
        name: false,
        surname: false,
        telephone_number: false,
        email: false,
        identification_number: false,
        date_of_birth: false
    });

    const [consentChecked, setConsentChecked] = useState(false);
    const [applicationSent, setApplicationSent] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const toast = useToast();

    const applyFinanceMutation = useApplyFinance();

    const validateField = (field: keyof FormData, value: string): string | undefined => {
        if (!value.trim()) {
            return 'This field is required';
        }

        switch (field) {
            case 'email':
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? 'Please enter a valid email address'
                    : undefined;
            case 'telephone_number':
                return !/^\d{9,}$/.test(value.replace(/\s/g, ''))
                    ? 'Please enter a valid telephone number'
                    : undefined;
            case 'identification_number':
                return value.length < 8
                    ? 'Please enter a valid identification number'
                    : undefined;
            case 'date_of_birth':
                return !/^\d{2}\/\d{2}\/\d{4}$/.test(value)
                    ? 'Please enter date in format DD/MM/YYYY'
                    : undefined;
            default:
                return value.length < 2
                    ? 'This field must be at least 2 characters long'
                    : undefined;
        }
    };

    const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, [field]: value });

        if (!touched[field]) {
            setTouched({ ...touched, [field]: true });
        }

        const validationError = validateField(field, value);
        setErrors({ ...errors, [field]: validationError });
    };

    const handleBlur = (field: keyof FormData) => () => {
        if (!touched[field]) {
            setTouched({ ...touched, [field]: true });
            const validationError = validateField(field, formData[field] || '');
            setErrors({ ...errors, [field]: validationError });
        }
    };

    const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConsentChecked(e.target.checked);
    };
    const searchParams = useSearchParams();

    const carId = searchParams?.get('carId');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FormErrors = {
            name: undefined,
            surname: undefined,
            telephone_number: undefined,
            email: undefined,
            identification_number: undefined,
            date_of_birth: undefined
        };

        let hasErrors = false;

        (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
            const error = validateField(field, formData[field] || '');
            if (error) {
                newErrors[field] = error;
                hasErrors = true;
            }
        });

        if (hasErrors) {
            setErrors(newErrors);
            setTouched({
                name: true,
                surname: true,
                telephone_number: true,
                email: true,
                identification_number: true,
                date_of_birth: true
            });
            return;
        }

        if (!consentChecked) {
            toast({
                title: "Consent required",
                description: "Please agree to the processing of personal data",
                status: "error",
                duration: 3000,
                isClosable: true
            });
            return;
        }
        console.log("form data", formData)
        if (!hasErrors && consentChecked) {
            // Call the API here
            // formData.append("car_id", carId)
            applyFinanceMutation.mutate({
                ...formData,
                telephone_number: `+43${formData.telephone_number.replace(/^(\+43)?/, '')}`,
                car_id: carId
            }, {
                onSuccess: (data) => {
                    // handle success (show confirmation, etc.)
                    setApplicationSent(true);
                    setShowConfirmation(true);
                    onSubmit();
                },
                onError: (error) => {
                    // handle error (show error message)
                    toast({
                        title: "Error",
                        description: "Failed to submit financing application.",
                        status: "error",
                        duration: 3000,
                        isClosable: true
                    });
                }
            });
        }
    };

    const getFieldStatusIcon = (field: keyof FormData) => {
        if (!touched[field] && !formData[field]) return null;

        if (errors[field]) {
            return (
                <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1" aria-hidden="true">
                    <Box bg={colors.errorColor} borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
                        <Text color="white" fontSize="xs" fontWeight="bold">!</Text>
                    </Box>
                </Box>
            );
        } else if (formData[field]) {
            return (
                <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1" aria-hidden="true">
                    <Box bg={colors.validColor} borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
                        <Check size={12} color="white" />
                    </Box>
                </Box>
            );
        }

        return null;
    };

    const renderIcon = (color: string) => (
        <Box mr={2} mt="2px" bg={colors.iconBackground} borderRadius="full" p="2px" aria-hidden="true">
            <Check size={16} color={color} />
        </Box>
    );

    // Border styles
    const grayBorderColor = useColorModeValue('#D3D3D3', '#4A5568');
    const grayborderstyle = {
        border: '1px solid',
        borderColor: grayBorderColor,
        borderRadius: 'lg',
        shadow: 'md'
    };

    // Checkbox colors
    const checkedBorderColor = useColorModeValue('red.500', 'red.300');
    const uncheckedBorderColor = useColorModeValue('gray.400', 'gray.500');
    const checkedBgColor = useColorModeValue('red.500', 'red.400');

    // Alert and notification colors for conditional rendering
    const alertBg = useColorModeValue("green.50", "green.900");
    const alertFlexBg = useColorModeValue("green.100", "green.800");
    const alertIconColor = useColorModeValue("green.500", "green.300");
    const alertTitleColor = useColorModeValue("gray.800", "white");
    const successBorderColor = useColorModeValue("green.100", "green.700");
    const infoBorderColor = useColorModeValue("red.100", "red.700");
    const infoBoxBg = useColorModeValue("#CE3131FF", "red.500");

    return (
        <Box position="relative" ml={{ base: 10, md: 14 }} mt={4} as="section" aria-labelledby="financing-form-title" style={grayborderstyle} borderRadius="lg">
            {/* SVG Connection line */}
            <Box position="absolute" top="-36px" left="-40px" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                    <path d="M20,20 L20,80 C20,86.6 25.4,92 32,92 L40,92" stroke={colors.connectionLine} strokeWidth="2" fill="none" />
                </svg>
            </Box>

            {/* Main container */}
            <Box bg={colors.cardBackground} borderRadius="md" boxShadow="sm" overflow="hidden" width="full" maxWidth="100%" borderWidth="1px" borderColor={colors.borderColor}>
                {/* Header section */}
                <Box py={4} px={6} borderBottomWidth="1px" borderColor={colors.borderColor} bg={colors.cardBackground}>
                    <Text
                        fontSize="md"
                        fontWeight="600"
                        color={colors.headerTextColor}
                        id="financing-form-title"
                    >
                        {data.header.title}
                    </Text>
                </Box>

                {/* Content section */}
                <Box py={5} px={6} bg={colors.cardBackground}>
                    <Text fontSize="sm" color={colors.textColor} lineHeight="1.6" mb={4}>{data.content.description}</Text>

                    {/* Information notice */}
                    <Box bg={colors.noticeBackground} p={4} borderRadius="md" mb={6} role="region" aria-label="Important information">
                        <Flex alignItems="center" mb={2}>
                            <Box mr={2} mt="2px" bg={colors.iconBackground} borderRadius="full" p="2px" aria-hidden="true">
                                <Info size={16} color={colors.infoIconColor} />
                            </Box>
                            <Text fontWeight="600" color={colors.headerTextColor}>{data.notice.title}</Text>
                        </Flex>

                        <Text fontSize="sm" color={colors.textColor} mb={4}>{data.notice.description}</Text>

                        {/* Document requirements */}
                        <Box as="ul" listStyleType="none" pl={0} mb={4}>
                            {data.requirements.primary.map((item, index) => (
                                <Box key={`req-${index}`} as="li" display="flex" alignItems="flex-start" mb={3}>
                                    {renderIcon(colors.checkIconColor)}
                                    <Text fontSize="sm" color={colors.textColor}>{item}</Text>
                                </Box>
                            ))}
                        </Box>

                        <Text fontSize="xs" color={colors.footerTextColor} mt={2}>{data.notice.footer}</Text>
                    </Box>

                    {/* Form section */}
                    <form onSubmit={handleSubmit} aria-label="Financing application form">
                        {!applicationSent ? (
                            <>
                                <Flex flexWrap="wrap" gap={4} mb={6}>
                                    {/* Name field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="name"
                                            color={colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            NAME
                                        </FormLabel>
                                        <Box position="relative">
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={handleChange('name')}
                                                onBlur={handleBlur('name')}
                                                placeholder="Name"
                                                borderColor={errors.name && touched.name ? colors.errorColor : formData.name && !errors.name ? colors.validColor : colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.name ? colors.errorColor : colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.name ? "true" : "false"}
                                                aria-required="true"
                                                autoComplete="given-name"
                                                bg={colors.cardBackground}
                                            />
                                            {getFieldStatusIcon('name')}
                                        </Box>
                                        {errors.name && touched.name && (
                                            <Text color={colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.name}</Text>
                                        )}
                                    </FormControl>

                                    {/* Surname field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="surname"
                                            color={colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            SURNAME
                                        </FormLabel>
                                        <Box position="relative">
                                            <Input
                                                id="surname"
                                                value={formData.surname}
                                                onChange={handleChange('surname')}
                                                onBlur={handleBlur('surname')}
                                                placeholder="Surname"
                                                borderColor={errors.surname && touched.surname ? colors.errorColor : formData.surname && !errors.surname ? colors.validColor : colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.surname ? colors.errorColor : colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.surname ? "true" : "false"}
                                                aria-required="true"
                                                autoComplete="family-name"
                                                bg={colors.cardBackground}
                                            />
                                            {getFieldStatusIcon('surname')}
                                        </Box>
                                        {errors.surname && touched.surname && (
                                            <Text color={colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.surname}</Text>
                                        )}
                                    </FormControl>

                                    {/* Telephone field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="telephone_number"
                                            color={colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            TELEPHONE NUMBER
                                        </FormLabel>
                                        <Flex>
                                            <Box width="70px" mr={2} borderWidth="1px" borderColor={colors.borderColor} borderRadius="md" display="flex" alignItems="center" justifyContent="center" height="40px" aria-label="Country code +43">
                                                <Box as="span" width="24px" height="16px" borderRadius="sm" bg="red" mr={1} aria-hidden="true"></Box>
                                                <Text fontSize="sm">+43</Text>
                                            </Box>
                                            <Box position="relative" flex="1">
                                                <Input
                                                    id="telephone_number"
                                                    value={formData.telephone_number}
                                                    onChange={handleChange('telephone_number')}
                                                    onBlur={handleBlur('telephone_number')}
                                                    placeholder="Telephone number"
                                                    borderColor={errors.telephone_number && touched.telephone_number ? colors.errorColor : formData.telephone_number && !errors.telephone_number ? colors.validColor : colors.borderColor}
                                                    borderWidth="1px"
                                                    height="40px"
                                                    _focus={{
                                                        borderColor: errors.telephone_number ? colors.errorColor : colors.validColor,
                                                        boxShadow: "none"
                                                    }}
                                                    isDisabled={applicationSent}
                                                    aria-invalid={errors.telephone_number ? "true" : "false"}
                                                    aria-required="true"
                                                    autoComplete="tel"
                                                    inputMode="tel"
                                                    bg={colors.cardBackground}
                                                />
                                                {getFieldStatusIcon('telephone_number')}
                                            </Box>
                                        </Flex>
                                        {errors.telephone_number && touched.telephone_number && (
                                            <Text color={colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.telephone_number}</Text>
                                        )}
                                    </FormControl>

                                    {/* Email field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="email"
                                            color={colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            EMAIL
                                        </FormLabel>
                                        <Box position="relative">
                                            <Input
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                                placeholder="Email"
                                                borderColor={errors.email && touched.email ? colors.errorColor : formData.email && !errors.email ? colors.validColor : colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.email ? colors.errorColor : colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.email ? "true" : "false"}
                                                aria-required="true"
                                                autoComplete="email"
                                                type="email"
                                                bg={colors.cardBackground}
                                            />
                                            {getFieldStatusIcon('email')}
                                        </Box>
                                        {errors.email && touched.email && (
                                            <Text color={colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.email}</Text>
                                        )}
                                    </FormControl>

                                    {/* DNI/NIE field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="customer_DNI_NIE"
                                            color={colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            IDENTIFICATION NUMBER (DNI/NIE)
                                        </FormLabel>
                                        <Box position="relative">
                                            <Input
                                                id="identification_number"
                                                value={formData.identification_number}
                                                onChange={handleChange('identification_number')}
                                                onBlur={handleBlur('identification_number')}
                                                placeholder="Identification number"
                                                borderColor={errors.identification_number && touched.identification_number ? colors.errorColor : formData.identification_number && !errors.identification_number ? colors.validColor : colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.identification_number ? colors.errorColor : colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.identification_number ? "true" : "false"}
                                                aria-required="true"
                                                bg={colors.cardBackground}
                                            />
                                            {getFieldStatusIcon('identification_number')}
                                        </Box>
                                        {errors.identification_number && touched.identification_number && (
                                            <Text color={colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.identification_number}</Text>
                                        )}
                                    </FormControl>

                                    {/* Date of Birth field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="customer_DOB"
                                            color={colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            DATE OF BIRTH
                                        </FormLabel>
                                        <Box position="relative">
                                            <Input
                                                id="date_of_birth"
                                                value={formData.date_of_birth}
                                                onChange={handleChange('date_of_birth')}
                                                onBlur={handleBlur('date_of_birth')}
                                                placeholder="DD/MM/YYYY"
                                                borderColor={errors.date_of_birth && touched.date_of_birth ? colors.errorColor : formData.date_of_birth && !errors.date_of_birth ? colors.validColor : colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.date_of_birth ? colors.errorColor : colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.date_of_birth ? "true" : "false"}
                                                aria-required="true"
                                                autoComplete="bday"
                                                bg={colors.cardBackground}
                                            />
                                            {getFieldStatusIcon('date_of_birth')}
                                        </Box>
                                        {errors.date_of_birth && touched.date_of_birth && (
                                            <Text color={colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.date_of_birth}</Text>
                                        )}
                                    </FormControl>
                                </Flex>

                                {/* Consent checkbox */}
                                <Box mb={6}>
                                    <Checkbox
                                        id="consent-checkbox"
                                        isChecked={consentChecked}
                                        onChange={handleConsentChange}
                                        size="md"
                                        colorScheme='red'
                                        isDisabled={applicationSent}
                                        sx={{
                                            '.chakra-checkbox__control': {
                                                borderColor: consentChecked ? checkedBorderColor : uncheckedBorderColor,
                                                backgroundColor: consentChecked ? checkedBgColor : 'transparent',
                                            },
                                        }}
                                    >
                                        <Text fontSize="sm" color={colors.textColor}>
                                            {data.consent.text}
                                        </Text>
                                    </Checkbox>
                                </Box>

                                {/* Submit button */}
                                <Flex direction="column" gap={3} align="center" width="100%">
                                    <Button
                                        type="submit"
                                        bg={colors.primaryButtonBg}
                                        color="white"
                                        _hover={{ bg: colors.primaryButtonHoverBg }}
                                        width="100%"
                                        maxWidth="400px"
                                        height={{ base: "auto", sm: "48px" }}
                                        minHeight="48px"
                                        py={2}
                                        px={4}
                                        isDisabled={!consentChecked}
                                        borderRadius="md"
                                        fontWeight="500"
                                        whiteSpace="normal"
                                        textAlign="center"
                                        aria-label="Submit financing application"
                                    >
                                        {data.buttons.check}
                                    </Button>
                                </Flex>
                            </>
                        ) : (
                            <>
                                {/* Confirmation message */}
                                <Alert
                                    status="success"
                                    variant="subtle"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    borderRadius="md"
                                    py={6}
                                    mb={6}
                                    role="status"
                                    aria-live="polite"
                                    bg={alertBg}
                                >
                                    <Flex
                                        width="60px"
                                        height="60px"
                                        borderRadius="full"
                                        bg={alertFlexBg}
                                        justifyContent="center"
                                        alignItems="center"
                                        mb={4}
                                    >
                                        <AlertIcon as={Mail} boxSize="30px" color={alertIconColor} />
                                    </Flex>
                                    <AlertTitle mt={4} mb={2} fontSize="lg" color={alertTitleColor}>
                                        Application Received!
                                    </AlertTitle>
                                    <AlertDescription maxWidth="sm" color={colors.textColor}>
                                        Thank you for submitting your financing application. You will receive an email with details about your financing options within 24 hours. Our finance team may contact you if additional information is needed.
                                    </AlertDescription>
                                </Alert>

                                {/* Success notification */}
                                <Box bg={colors.successBackground} p={4} borderRadius="md" mb={4} role="status" borderWidth="1px" borderColor={successBorderColor}>
                                    <Flex alignItems="flex-start">
                                        <Box mr={2} mt="2px" aria-hidden="true">
                                            <Box bg={colors.validColor} borderRadius="full" p="2px">
                                                <Check size={16} color="white" />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="600" color={colors.headerTextColor} mb={1}>{data.thanks.title}</Text>
                                            <Text fontSize="sm" color={colors.textColor}>{data.thanks.description}</Text>
                                        </Box>
                                    </Flex>
                                </Box>

                                {/* Info notification */}
                                <Box bg={colors.infoBackground} p={4} borderRadius="md" mb={6} role="region" aria-label="Processing information" borderWidth="1px" borderColor={infoBorderColor}>
                                    <Flex alignItems="flex-start">
                                        <Box mr={2} mt="2px" aria-hidden="true">
                                            <Box bg={infoBoxBg} borderRadius="full" p="2px">
                                                <Info size={16} color="white" />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color={colors.textColor}>{data.info.title}</Text>
                                            <Text fontSize="sm" color={colors.textColor}>{data.info.description}</Text>
                                        </Box>
                                    </Flex>
                                </Box>
                            </>
                        )}
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default FinancingForm; 