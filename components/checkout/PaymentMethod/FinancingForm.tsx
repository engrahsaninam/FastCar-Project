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
    useToast
} from '@chakra-ui/react';
import { Check, Info } from 'lucide-react';

interface FormData {
    name: string;
    surname: string;
    telephone: string;
    email: string;
}

interface FormErrors {
    name?: string;
    surname?: string;
    telephone?: string;
    email?: string;
}

interface TouchedFields {
    name?: boolean;
    surname?: boolean;
    telephone?: boolean;
    email?: boolean;
}

interface FinancingFormProps {
    onSubmit: () => void;
    onDecline: () => void;
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
        check: "Check the financing options (non-binding)",
        decline: "Thank you, I'm not interested anymore",
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

const FinancingForm: React.FC<FinancingFormProps> = ({ onSubmit, onDecline }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        surname: '',
        telephone: '',
        email: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});
    const [consentChecked, setConsentChecked] = useState(false);
    const [applicationSent, setApplicationSent] = useState(false);
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
            const validationError = validateField(field, formData[field]);
            setErrors({ ...errors, [field]: validationError });
        }
    };

    const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConsentChecked(e.target.checked);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FormErrors = {};
        let hasErrors = false;

        (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
            const error = validateField(field, formData[field]);
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
                telephone: true,
                email: true
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
        onSubmit();
    };

    const getFieldStatusIcon = (field: keyof FormData) => {
        if (!touched[field] && !formData[field]) return null;

        if (errors[field]) {
            return (
                <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
                    <Box bg={data.colors.errorColor} borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
                        <Text color="white" fontSize="xs" fontWeight="bold">!</Text>
                    </Box>
                </Box>
            );
        } else if (formData[field]) {
            return (
                <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
                    <Box bg={data.colors.validColor} borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
                        <Check size={12} color="white" />
                    </Box>
                </Box>
            );
        }

        return null;
    };

    const renderIcon = (color: string) => (
        <Box mr={2} mt="2px" bg={data.colors.iconBackground} borderRadius="full" p="2px">
            <Check size={16} color={color} />
        </Box>
    );

    return (
        <Box position="relative" ml={{ base: 10, md: 14 }} mt={4}>
            {/* SVG Connection line */}
            <Box position="absolute" top="-36px" left="-40px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                    <path d="M20,20 L20,80 C20,86.6 25.4,92 32,92 L40,92" stroke={data.colors.connectionLine} strokeWidth="2" fill="none" />
                </svg>
            </Box>

            {/* Main container */}
            <Box bg={data.colors.cardBackground} borderRadius="md" boxShadow="sm" overflow="hidden" width="full" maxWidth="100%" borderWidth="1px" borderColor={data.colors.borderColor}>
                {/* Header section */}
                <Box py={4} px={6} borderBottomWidth="1px" borderColor={data.colors.borderColor} bg={data.colors.cardBackground}>
                    <Text fontSize="md" fontWeight="600" color={data.colors.headerTextColor}>{data.header.title}</Text>
                </Box>

                {/* Content section */}
                <Box py={5} px={6} bg={data.colors.cardBackground}>
                    <Text fontSize="sm" color={data.colors.textColor} lineHeight="1.6" mb={4}>{data.content.description}</Text>

                    {/* Information notice */}
                    <Box bg={data.colors.noticeBackground} p={4} borderRadius="md" mb={6}>
                        <Flex alignItems="center" mb={2}>
                            <Box mr={2} mt="2px" bg={data.colors.iconBackground} borderRadius="full" p="2px">
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
                    <form onSubmit={handleSubmit}>
                        <Flex flexWrap="wrap" gap={4} mb={6}>
                            {/* Name field */}
                            <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                <FormLabel color={data.colors.headerTextColor} fontWeight="500" fontSize="sm">NAME</FormLabel>
                                <Box position="relative">
                                    <Input
                                        value={formData.name}
                                        onChange={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        placeholder="Name"
                                        borderColor={errors.name && touched.name ? data.colors.errorColor : formData.name && !errors.name ? data.colors.validColor : data.colors.borderColor}
                                        borderWidth="1px"
                                        height="40px"
                                        _focus={{
                                            borderColor: errors.name ? data.colors.errorColor : data.colors.validColor,
                                            boxShadow: "none"
                                        }}
                                        isDisabled={applicationSent}
                                    />
                                    {getFieldStatusIcon('name')}
                                </Box>
                                {errors.name && touched.name && (
                                    <Text color={data.colors.errorColor} fontSize="xs" mt={1}>{errors.name}</Text>
                                )}
                            </FormControl>

                            {/* Surname field */}
                            <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                <FormLabel color={data.colors.headerTextColor} fontWeight="500" fontSize="sm">SURNAME</FormLabel>
                                <Box position="relative">
                                    <Input
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
                                    />
                                    {getFieldStatusIcon('surname')}
                                </Box>
                                {errors.surname && touched.surname && (
                                    <Text color={data.colors.errorColor} fontSize="xs" mt={1}>{errors.surname}</Text>
                                )}
                            </FormControl>

                            {/* Telephone field */}
                            <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                <FormLabel color={data.colors.headerTextColor} fontWeight="500" fontSize="sm">TELEPHONE NUMBER</FormLabel>
                                <Flex>
                                    <Box width="70px" mr={2} borderWidth="1px" borderColor={data.colors.borderColor} borderRadius="md" display="flex" alignItems="center" justifyContent="center" height="40px">
                                        <Box as="span" width="24px" height="16px" borderRadius="sm" bg="red" mr={1}></Box>
                                        <Text fontSize="sm">+43</Text>
                                    </Box>
                                    <Box position="relative" flex="1">
                                        <Input
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
                                        />
                                        {getFieldStatusIcon('telephone')}
                                    </Box>
                                </Flex>
                                {errors.telephone && touched.telephone && (
                                    <Text color={data.colors.errorColor} fontSize="xs" mt={1}>{errors.telephone}</Text>
                                )}
                            </FormControl>

                            {/* Email field */}
                            <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                                <FormLabel color={data.colors.headerTextColor} fontWeight="500" fontSize="sm">EMAIL</FormLabel>
                                <Box position="relative">
                                    <Input
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
                                    />
                                    {getFieldStatusIcon('email')}
                                </Box>
                                {errors.email && touched.email && (
                                    <Text color={data.colors.errorColor} fontSize="xs" mt={1}>{errors.email}</Text>
                                )}
                            </FormControl>
                        </Flex>

                        {/* Success notification */}
                        <Box bg={data.colors.successBackground} p={4} borderRadius="md" mb={4}>
                            <Flex alignItems="flex-start">
                                <Box mr={2} mt="2px">
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
                        <Box bg={data.colors.infoBackground} p={4} borderRadius="md" mb={6}>
                            <Flex alignItems="flex-start">
                                <Box mr={2} mt="2px">
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

                        {/* Consent checkbox */}
                        <Box mb={6}>
                            <Checkbox
                                isChecked={consentChecked}
                                onChange={handleConsentChange}
                                colorScheme="red"
                                size="md"
                                isDisabled={applicationSent}
                            >
                                <Text fontSize="sm" color={data.colors.textColor}>{data.consent.text}</Text>
                            </Checkbox>
                        </Box>

                        {/* Action buttons */}
                        <Flex direction="column" gap={3} align="center" width="100%">
                            {applicationSent ? (
                                <Button
                                    type="button"
                                    bg={data.colors.sentButtonBg}
                                    color="white"
                                    width="100%"
                                    maxWidth="400px"
                                    height={{ base: "auto", sm: "48px" }}
                                    minHeight="48px"
                                    py={2}
                                    px={4}
                                    isDisabled={true}
                                    borderRadius="md"
                                    fontWeight="500"
                                    whiteSpace="normal"
                                    textAlign="center"
                                    leftIcon={<Check size={18} />}
                                >
                                    {data.buttons.sent}
                                </Button>
                            ) : (
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
                                >
                                    {data.buttons.check}
                                </Button>
                            )}

                            {!applicationSent && (
                                <Button
                                    variant="link"
                                    color="#E53E3E"
                                    fontSize="sm"
                                    _hover={{ textDecoration: "underline" }}
                                    fontWeight="normal"
                                    height="auto"
                                    paddingBottom="20px"
                                    whiteSpace="normal"
                                    textAlign="center"
                                    onClick={onDecline}
                                >
                                    {data.buttons.decline}
                                </Button>
                            )}
                        </Flex>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default FinancingForm; 