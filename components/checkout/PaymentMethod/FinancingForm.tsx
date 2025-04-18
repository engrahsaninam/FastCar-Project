import React, { useState } from 'react';
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
    AlertDescription
} from '@chakra-ui/react';
import { Check, Info, Mail } from 'lucide-react';

interface FormData {
    client_name: string;
    surname: string;
    telephone: string;
    email: string;
    customer_DNI_NIE: string;
    customer_DOB: string;
}

interface FormErrors {
    client_name?: string;
    surname?: string;
    telephone?: string;
    email?: string;
    customer_DNI_NIE?: string;
    customer_DOB?: string;
}

interface TouchedFields {
    client_name?: boolean;
    surname?: boolean;
    telephone?: boolean;
    email?: boolean;
    customer_DNI_NIE?: boolean;
    customer_DOB?: boolean;
}

interface FinancingFormProps {
    onSubmit: () => void;
    // onDecline: () => void;
}

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
    },
    colors: {
        connectionLine: "#FFA9A9",
        cardBackground: "white",
        headerTextColor: "#2E3A59",
        noticeBackground: "#FCF8F8FF",
        borderColor: "#EDF2F7",
        textColor: "#4A5568",
        infoIconColor: "#CE3131FF",
        iconBackground: "#FBE6E6FF",
        footerTextColor: "#718096",
        checkIconColor: "#CE3131FF",
        errorColor: "#E53E3E",
        validColor: "#38A169",
        successBackground: "#F0FFF4",
        infoBackground: "#FFEBEBFF",
        primaryButtonBg: "#DD4C4CFF",
        primaryButtonHoverBg: "#B93A3AFF",
        sentButtonBg: "#CBD5E0"
    }
};

const FinancingForm: React.FC<FinancingFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<FormData>({
        client_name: '',
        surname: '',
        telephone: '',
        email: '',
        customer_DNI_NIE: '',
        customer_DOB: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        client_name: undefined,
        surname: undefined,
        telephone: undefined,
        email: undefined,
        customer_DNI_NIE: undefined,
        customer_DOB: undefined
    });

    const [touched, setTouched] = useState<TouchedFields>({
        client_name: false,
        surname: false,
        telephone: false,
        email: false,
        customer_DNI_NIE: false,
        customer_DOB: false
    });

    const [consentChecked, setConsentChecked] = useState(false);
    const [applicationSent, setApplicationSent] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const toast = useToast();

    const validateField = (field: keyof FormData, value: string): string | undefined => {
        if (!value.trim()) {
            return 'This field is required';
        }

        switch (field) {
            case 'email':
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? 'Please enter a valid email address'
                    : undefined;
            case 'telephone':
                return !/^\d{9,}$/.test(value.replace(/\s/g, ''))
                    ? 'Please enter a valid telephone number'
                    : undefined;
            case 'customer_DNI_NIE':
                return value.length < 8
                    ? 'Please enter a valid identification number'
                    : undefined;
            case 'customer_DOB':
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FormErrors = {
            client_name: undefined,
            surname: undefined,
            telephone: undefined,
            email: undefined,
            customer_DNI_NIE: undefined,
            customer_DOB: undefined
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
                client_name: true,
                surname: true,
                telephone: true,
                email: true,
                customer_DNI_NIE: true,
                customer_DOB: true
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

        setApplicationSent(true);
        setShowConfirmation(true);

        // Scroll to the confirmation message
        toast({
            title: "",
            position:'top',
            description: "You'll receive an email in 24 hours. Thank You",
            status: "error",
            duration: 3000,
            isClosable: true
        });

        onSubmit();
    };

    const getFieldStatusIcon = (field: keyof FormData) => {
        if (!touched[field] && !formData[field]) return null;

        if (errors[field]) {
            return (
                <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1" aria-hidden="true">
                    <Box bg={data.colors.errorColor} borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
                        <Text color="white" fontSize="xs" fontWeight="bold">!</Text>
                    </Box>
                </Box>
            );
        } else if (formData[field]) {
            return (
                <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1" aria-hidden="true">
                    <Box bg={data.colors.validColor} borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
                        <Check size={12} color="white" />
                    </Box>
                </Box>
            );
        }

        return null;
    };

    const renderIcon = (color: string) => (
        <Box mr={2} mt="2px" bg={data.colors.iconBackground} borderRadius="full" p="2px" aria-hidden="true">
            <Check size={16} color={color} />
        </Box>
    );
    const grayborderstyle = {
        border: '1px solid #D3D3D3',
        borderRadius: 'lg',
        shadow: 'md'
    }
    return (
        <Box position="relative" ml={{ base: 10, md: 14 }} mt={4} as="section" aria-labelledby="financing-form-title" style={grayborderstyle} borderRadius="lg">
            {/* SVG Connection line */}
            <Box position="absolute" top="-36px" left="-40px" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                    <path d="M20,20 L20,80 C20,86.6 25.4,92 32,92 L40,92" stroke={data.colors.connectionLine} strokeWidth="2" fill="none" />
                </svg>
            </Box>

            {/* Main container */}
            <Box bg={data.colors.cardBackground} borderRadius="md" boxShadow="sm" overflow="hidden" width="full" maxWidth="100%" borderWidth="1px" borderColor={data.colors.borderColor}>
                {/* Header section */}
                <Box py={4} px={6} borderBottomWidth="1px" borderColor={data.colors.borderColor} bg={data.colors.cardBackground}>
                    <Text
                        fontSize="md"
                        fontWeight="600"
                        color={data.colors.headerTextColor}
                        id="financing-form-title"
                    >
                        {data.header.title}
                    </Text>
                </Box>

                {/* Content section */}
                <Box py={5} px={6} bg={data.colors.cardBackground}>
                    <Text fontSize="sm" color={data.colors.textColor} lineHeight="1.6" mb={4}>{data.content.description}</Text>

                    {/* Information notice */}
                    <Box bg={data.colors.noticeBackground} p={4} borderRadius="md" mb={6} role="region" aria-label="Important information">
                        <Flex alignItems="center" mb={2}>
                            <Box mr={2} mt="2px" bg={data.colors.iconBackground} borderRadius="full" p="2px" aria-hidden="true">
                                <Info size={16} color={data.colors.infoIconColor} />
                            </Box>
                            <Text fontWeight="600" color={data.colors.headerTextColor}>{data.notice.title}</Text>
                        </Flex>

                        <Text fontSize="sm" color={data.colors.textColor} mb={4}>{data.notice.description}</Text>

                        {/* Document requirements */}
                        <Box as="ul" listStyleType="none" pl={0} mb={4}>
                            {data.requirements.primary.map((item, index) => (
                                <Box key={`req-${index}`} as="li" display="flex" alignItems="flex-start" mb={3}>
                                    {renderIcon(data.colors.checkIconColor)}
                                    <Text fontSize="sm" color={data.colors.textColor}>{item}</Text>
                                </Box>
                            ))}
                        </Box>

                        <Text fontSize="xs" color={data.colors.footerTextColor} mt={2}>{data.notice.footer}</Text>
                    </Box>

                    {/* Form section */}
                    <form onSubmit={handleSubmit} aria-label="Financing application form">
                        {!applicationSent ? (
                            <>
                                <Flex flexWrap="wrap" gap={4} mb={6}>
                                    {/* Name field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="client_name"
                                            color={data.colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            NAME
                                        </FormLabel>
                                        <Box position="relative">
                                            <Input
                                                id="client_name"
                                                value={formData.client_name}
                                                onChange={handleChange('client_name')}
                                                onBlur={handleBlur('client_name')}
                                                placeholder="Name"
                                                borderColor={errors.client_name && touched.client_name ? data.colors.errorColor : formData.client_name && !errors.client_name ? data.colors.validColor : data.colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.client_name ? data.colors.errorColor : data.colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.client_name ? "true" : "false"}
                                                aria-required="true"
                                                autoComplete="given-name"
                                            />
                                            {getFieldStatusIcon('client_name')}
                                        </Box>
                                        {errors.client_name && touched.client_name && (
                                            <Text color={data.colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.client_name}</Text>
                                        )}
                                    </FormControl>

                                    {/* Surname field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="surname"
                                            color={data.colors.headerTextColor}
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
                                                borderColor={errors.surname && touched.surname ? data.colors.errorColor : formData.surname && !errors.surname ? data.colors.validColor : data.colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.surname ? data.colors.errorColor : data.colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.surname ? "true" : "false"}
                                                aria-required="true"
                                                autoComplete="family-name"
                                            />
                                            {getFieldStatusIcon('surname')}
                                        </Box>
                                        {errors.surname && touched.surname && (
                                            <Text color={data.colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.surname}</Text>
                                        )}
                                    </FormControl>

                                    {/* Telephone field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="telephone"
                                            color={data.colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            TELEPHONE NUMBER
                                        </FormLabel>
                                        <Flex>
                                            <Box width="70px" mr={2} borderWidth="1px" borderColor={data.colors.borderColor} borderRadius="md" display="flex" alignItems="center" justifyContent="center" height="40px" aria-label="Country code +43">
                                                <Box as="span" width="24px" height="16px" borderRadius="sm" bg="red" mr={1} aria-hidden="true"></Box>
                                                <Text fontSize="sm">+43</Text>
                                            </Box>
                                            <Box position="relative" flex="1">
                                                <Input
                                                    id="telephone"
                                                    value={formData.telephone}
                                                    onChange={handleChange('telephone')}
                                                    onBlur={handleBlur('telephone')}
                                                    placeholder="Telephone number"
                                                    borderColor={errors.telephone && touched.telephone ? data.colors.errorColor : formData.telephone && !errors.telephone ? data.colors.validColor : data.colors.borderColor}
                                                    borderWidth="1px"
                                                    height="40px"
                                                    _focus={{
                                                        borderColor: errors.telephone ? data.colors.errorColor : data.colors.validColor,
                                                        boxShadow: "none"
                                                    }}
                                                    isDisabled={applicationSent}
                                                    aria-invalid={errors.telephone ? "true" : "false"}
                                                    aria-required="true"
                                                    autoComplete="tel"
                                                    inputMode="tel"
                                                />
                                                {getFieldStatusIcon('telephone')}
                                            </Box>
                                        </Flex>
                                        {errors.telephone && touched.telephone && (
                                            <Text color={data.colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.telephone}</Text>
                                        )}
                                    </FormControl>

                                    {/* Email field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="email"
                                            color={data.colors.headerTextColor}
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
                                                borderColor={errors.email && touched.email ? data.colors.errorColor : formData.email && !errors.email ? data.colors.validColor : data.colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.email ? data.colors.errorColor : data.colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.email ? "true" : "false"}
                                                aria-required="true"
                                                autoComplete="email"
                                                type="email"
                                            />
                                            {getFieldStatusIcon('email')}
                                        </Box>
                                        {errors.email && touched.email && (
                                            <Text color={data.colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.email}</Text>
                                        )}
                                    </FormControl>

                                    {/* DNI/NIE field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="customer_DNI_NIE"
                                            color={data.colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            IDENTIFICATION NUMBER (DNI/NIE)
                                        </FormLabel>
                                        <Box position="relative">
                                            <Input
                                                id="customer_DNI_NIE"
                                                value={formData.customer_DNI_NIE}
                                                onChange={handleChange('customer_DNI_NIE')}
                                                onBlur={handleBlur('customer_DNI_NIE')}
                                                placeholder="Identification number"
                                                borderColor={errors.customer_DNI_NIE && touched.customer_DNI_NIE ? data.colors.errorColor : formData.customer_DNI_NIE && !errors.customer_DNI_NIE ? data.colors.validColor : data.colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.customer_DNI_NIE ? data.colors.errorColor : data.colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.customer_DNI_NIE ? "true" : "false"}
                                                aria-required="true"
                                            />
                                            {getFieldStatusIcon('customer_DNI_NIE')}
                                        </Box>
                                        {errors.customer_DNI_NIE && touched.customer_DNI_NIE && (
                                            <Text color={data.colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.customer_DNI_NIE}</Text>
                                        )}
                                    </FormControl>

                                    {/* Date of Birth field */}
                                    <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                        <FormLabel
                                            htmlFor="customer_DOB"
                                            color={data.colors.headerTextColor}
                                            fontWeight="500"
                                            fontSize="sm"
                                        >
                                            DATE OF BIRTH
                                        </FormLabel>
                                        <Box position="relative">
                                            <Input
                                                id="customer_DOB"
                                                value={formData.customer_DOB}
                                                onChange={handleChange('customer_DOB')}
                                                onBlur={handleBlur('customer_DOB')}
                                                placeholder="DD/MM/YYYY"
                                                borderColor={errors.customer_DOB && touched.customer_DOB ? data.colors.errorColor : formData.customer_DOB && !errors.customer_DOB ? data.colors.validColor : data.colors.borderColor}
                                                borderWidth="1px"
                                                height="40px"
                                                _focus={{
                                                    borderColor: errors.customer_DOB ? data.colors.errorColor : data.colors.validColor,
                                                    boxShadow: "none"
                                                }}
                                                isDisabled={applicationSent}
                                                aria-invalid={errors.customer_DOB ? "true" : "false"}
                                                aria-required="true"
                                                autoComplete="bday"
                                            />
                                            {getFieldStatusIcon('customer_DOB')}
                                        </Box>
                                        {errors.customer_DOB && touched.customer_DOB && (
                                            <Text color={data.colors.errorColor} fontSize="xs" mt={1} role="alert">{errors.customer_DOB}</Text>
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
                                                borderColor: consentChecked ? 'red.500' : 'gray.400',
                                                backgroundColor: consentChecked ? 'red.500' : 'transparent',
                                            },
                                        }}
                                    >
                                        <Text fontSize="sm" color={data.colors.textColor}>
                                            {data.consent.text}
                                        </Text>
                                    </Checkbox>
                                </Box>

                                {/* Submit button - only shown before submission */}
                                <Flex direction="column" gap={3} align="center" width="100%">
                                    <Button
                                        type="submit"
                                        bg="#E53E3E"
                                        color="white"
                                        _hover={{ bg: "#C53030" }}
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
                                >
                                    <Flex
                                        width="60px"
                                        height="60px"
                                        borderRadius="full"
                                        bg="green.100"
                                        justifyContent="center"
                                        alignItems="center"
                                        mb={4}
                                    >
                                        <AlertIcon as={Mail} boxSize="30px" color="green.500" />
                                    </Flex>
                                    <AlertTitle mt={4} mb={2} fontSize="lg">
                                        Application Received!
                                    </AlertTitle>
                                    <AlertDescription maxWidth="sm">
                                        Thank you for submitting your financing application. You will receive an email with details about your financing options within 24 hours. Our finance team may contact you if additional information is needed.
                                    </AlertDescription>
                                </Alert>

                                {/* Success notification */}
                                <Box bg={data.colors.successBackground} p={4} borderRadius="md" mb={4} role="status">
                                    <Flex alignItems="flex-start">
                                        <Box mr={2} mt="2px" aria-hidden="true">
                                            <Box bg={data.colors.validColor} borderRadius="full" p="2px">
                                                <Check size={16} color="white" />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Text fontWeight="600" color={data.colors.headerTextColor} mb={1}>{data.thanks.title}</Text>
                                            <Text fontSize="sm" color={data.colors.textColor}>{data.thanks.description}</Text>
                                        </Box>
                                    </Flex>
                                </Box>

                                {/* Info notification */}
                                <Box bg={data.colors.infoBackground} p={4} borderRadius="md" mb={6} role="region" aria-label="Processing information">
                                    <Flex alignItems="flex-start">
                                        <Box mr={2} mt="2px" aria-hidden="true">
                                            <Box bg="#CE3131FF" borderRadius="full" p="2px">
                                                <Info size={16} color="white" />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color={data.colors.textColor}>{data.info.title}</Text>
                                            <Text fontSize="sm" color={data.colors.textColor}>{data.info.description}</Text>
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