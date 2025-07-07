import React from 'react';
import {
    Box,
    Text,
    Flex,
    Divider,
    Button,
    Textarea,
    Grid,
    GridItem,
    VStack,
    HStack,
    Icon,
    Radio,
    RadioGroup,
    Stack,
    Image,
    Checkbox,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    InputGroup,
    InputRightElement,
    FormControl,
    FormLabel,
    useDisclosure,
    Center,
    useColorModeValue,
    useBreakpointValue
} from '@chakra-ui/react';
import { Edit2, CreditCard, ChevronLeft, Lock, X } from 'lucide-react';
import { cp } from 'fs';
import { useCreateInspectionSession } from '@/services/cars/useCars';
import { useSearchParams } from 'next/navigation';

interface OrderSummaryContentProps {
    onComplete: () => void;
    billingData?: {
        address: string;
    };
    contactData?: {
        name: string;
        address: string;
        email: string;
        phone: string;
    };
}

const OrderSummaryContent: React.FC<OrderSummaryContentProps> = ({
    onComplete,
    billingData = {
        address: "st 9 Fazal town phase 2, Rawalpindi, 37139"
    },
    contactData = {
        name: "Laraib khan",
        address: "st 9 Fazal town phase 2, Rawalpindi, 37139",
        email: "517laraibkhan@gmail.com",
        phone: "+39 3471234567"
    }
}) => {
    // Responsive values
    const isMobile = useBreakpointValue({ base: true, md: false });
    const contentPadding = useBreakpointValue({ base: 4, md: 6 });
    const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
    const subheadingSize = useBreakpointValue({ base: "lg", md: "xl" });
    const textSize = useBreakpointValue({ base: "sm", md: "md" });
    const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
    const buttonPadding = useBreakpointValue({ base: 8, md: 12 });
    const paymentIconSize = useBreakpointValue({ base: "24px", md: "30px" });
    const paymentIconWidth = useBreakpointValue({ base: "40px", md: "50px" });

    // Color mode values
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("#D3D3D3", "gray.600");
    const headingColor = useColorModeValue("navy.800", "white");
    const textColor = useColorModeValue("gray.800", "gray.300");
    const subTextColor = useColorModeValue("gray.600", "gray.400");

    const buttonBgColor = useColorModeValue("red.500", "red.600");
    const buttonHoverBgColor = useColorModeValue("red.600", "red.500");
    const editButtonColor = useColorModeValue("blue.600", "blue.400");
    const editButtonHoverBg = useColorModeValue("blue.50", "blue.800");

    const dividerColor = useColorModeValue("gray.300", "gray.600");
    const inputBorderColor = useColorModeValue("gray.300", "gray.600");
    const inputBgColor = useColorModeValue("white", "gray.700");

    const redHighlightColor = useColorModeValue("red.500", "red.400");
    const redTextColor = useColorModeValue("red.500", "red.400");
    const redBgColor = useColorModeValue("red.50", "red.900");

    const modalBgColor = useColorModeValue("white", "gray.800");
    const modalBorderColor = useColorModeValue("gray.100", "gray.700");
    const modalOverlayColor = useColorModeValue("blackAlpha.300", "blackAlpha.600");

    const formLabelColor = useColorModeValue("gray.600", "gray.400");
    const inputColor = useColorModeValue("gray.500", "gray.300");
    const formBgColor = useColorModeValue("gray.50", "gray.700");

    // Additional color values for conditional cases
    const checkboxBorderUncheckedColor = useColorModeValue('gray.400', 'gray.500');
    const redHoverColor = useColorModeValue('red.600', 'red.300');
    const totalBorderColor = useColorModeValue("red.100", "red.800");
    const inputFocusBorderColor = useColorModeValue("blue.500", "blue.300");
    const cvvIconBgColor = useColorModeValue("gray.100", "gray.600");

    // Save card checkbox colors
    const saveCardBorderColor = useColorModeValue('gray.400', 'gray.500');
    const saveCardBgColor = useColorModeValue("gray.50", "gray.700");
    const saveCardBorderWidth = useColorModeValue("1px", "1px");
    const saveCardBorderColorValue = useColorModeValue("gray.200", "gray.600");

    // GoPay colors
    const gPayBgColor = useColorModeValue("blue.50", "blue.800");
    const gPayTextColor = useColorModeValue("blue.500", "blue.300");
    const learnMoreColor = useColorModeValue("blue.500", "blue.300");

    // Payment button colors
    const paymentButtonHoverBg = useColorModeValue("red.600", "red.500");

    // Input hover border color
    const inputHoverBorderColor = useColorModeValue("gray.400", "gray.500");

    const [question, setQuestion] = React.useState("");
    const [paymentMethod, setPaymentMethod] = React.useState("online");
    const [termsAccepted, setTermsAccepted] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Payment form state
    const [cardNumber, setCardNumber] = React.useState("1234 1234 1234 1234");
    const [expiryDate, setExpiryDate] = React.useState("MM/YY");
    const [cvv, setCvv] = React.useState("123");
    const [saveCard, setSaveCard] = React.useState(false);
    const { mutate: createInspectionSession } = useCreateInspectionSession();
    const searchParams = useSearchParams() ?? new URLSearchParams();
    const carId = searchParams.get('carId');

    const handlePaymentSubmit = () => {
        onClose();
        onComplete();
    };
    const handleCreateInspectionSession = () => {
        if (!carId) return;
        createInspectionSession(carId, {
            onSuccess: (data) => {
                // data should contain the Stripe checkout URL
                if (data && typeof data.checkout_url === 'string') {
                    const match = data.checkout_url.match(/\/pay\/([^/?#]+)/);
                    if (match && match[1]) {
                        sessionStorage.setItem('stripeSessionId', match[1]);
                    }
                }
                // console.log("response from stripe", data);
                window.location.href = data.checkout_url;
            },
            onError: (error) => {
                console.error(error);
            }
        });
    };

    return (
        <>
            <Box borderRadius="xl" border="1px solid" borderColor={borderColor}>
                {/* Main Container */}
                <Box bg={bgColor} p={contentPadding}>
                    <Text fontSize={headingSize} fontWeight="bold" mb={4} color={headingColor}>Order summary</Text>

                    <Divider my={4} borderColor={dividerColor} />

                    {/* Billing and Contact Information */}
                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 6, md: 8 }} mb={6}>
                        {/* Billing Data */}
                        <GridItem>
                            <VStack align="stretch" spacing={{ base: 2, md: 3 }}>
                                <Text fontSize={subheadingSize} fontWeight="semibold" color={headingColor}>Billing/invoice data</Text>
                                <Text color={subTextColor} fontSize={textSize}>Your/your company's details for the tax invoice</Text>
                                <Text color={textColor} mt={3}>{billingData.address}</Text>
                            </VStack>
                        </GridItem>

                        {/* Contact Data */}
                        <GridItem>
                            <VStack align="stretch" spacing={{ base: 2, md: 3 }}>
                                <Text fontSize={subheadingSize} fontWeight="semibold" color={headingColor}>Contact data</Text>
                                <Text color={subTextColor} fontSize={textSize}>Contact data, where we can reach you regarding your purchase</Text>

                                <Text fontWeight="medium" mt={2} color={textColor}>{contactData.name}</Text>
                                <Text color={textColor}>{contactData.address}</Text>
                                <Text color={textColor}>{contactData.email}</Text>
                                <Text color={textColor}>{contactData.phone}</Text>
                            </VStack>
                        </GridItem>
                    </Grid>

                    {/* Edit Button */}
                    <Flex justifyContent="flex-end" mb={6}>
                        <Button
                            rightIcon={<Icon as={Edit2} boxSize={isMobile ? 3.5 : 4} />}
                            variant="ghost"
                            color={editButtonColor}
                            size={isMobile ? "sm" : "md"}
                            _hover={{ bg: editButtonHoverBg }}
                        >
                            Edit the data
                        </Button>
                    </Flex>
                </Box>

                {/* Order Details */}
                <Box bg={bgColor} p={contentPadding} borderRadius="xl" mt={6}>
                    <Text fontSize={subheadingSize} fontWeight="bold" mb={6} color={headingColor}>Summary of your order</Text>

                    {/* Order Line Items */}
                    <Flex justifyContent="space-between" py={4}>
                        <Text fontSize={textSize} fontWeight="medium" color={textColor}>CarAudit™</Text>
                        <Text fontSize={textSize} fontWeight="medium" color={textColor}>€119</Text>
                    </Flex>

                    {/* Total */}
                    <Box bg={redBgColor} p={4} borderRadius="md" mb={6} borderWidth="1px" borderColor={totalBorderColor}>
                        <Flex justifyContent="space-between">
                            <Text fontSize={textSize} fontWeight="semibold" color={redTextColor}>To pay</Text>
                            <Text fontSize={textSize} fontWeight="semibold" color={redTextColor}>€119</Text>
                        </Flex>
                    </Box>

                    {/* Description Text */}
                    <Text color={subTextColor} mb={8} fontSize={textSize}>
                        After you pay for the car inspection, we will immediately start the inspection and then send you the CarAudit technical report. You can then decide whether to purchase the car.
                    </Text>

                    {/* Question Section */}
                    <VStack align="stretch" spacing={3} mb={8}>
                        <Text fontWeight="bold" color={headingColor} textTransform="uppercase" fontSize={textSize}>
                            Do you have a question about the condition or equipment of the vehicle?
                        </Text>
                        <Flex justify="flex-end">
                            <Text fontSize="xs" color={subTextColor}>0/500</Text>
                        </Flex>
                        <Textarea
                            placeholder="For example, whether there are any requirements the car must meet to be purchased, etc."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            maxLength={500}
                            resize="vertical"
                            h={{ base: "100px", md: "120px" }}
                            borderColor={inputBorderColor}
                            bg={inputBgColor}
                            color={textColor}
                            fontSize={textSize}
                            _hover={{ borderColor: inputHoverBorderColor }}
                            _focus={{ borderColor: inputFocusBorderColor }}
                        />
                    </VStack>

                    {/* Payment Method Section */}
                    <Box mb={8}>
                        <Text fontWeight="bold" mb={4} color={headingColor} fontSize={textSize}>
                            Method of payment
                        </Text>
                        <Text color={subTextColor} mb={4} fontSize={textSize}>
                            Select your first payment method. The surcharge for the car is then always paid by transfer.
                        </Text>

                        {/* Payment Option */}
                        <Box
                            borderWidth="1px"
                            borderColor="transparent"
                            borderRadius="md"
                            bg={buttonBgColor}
                            color="white"
                            p={4}
                            mb={6}
                        >
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                flexDirection={isMobile ? "column" : "row"}
                                gap={isMobile ? 4 : 0}
                            >
                                <Flex alignItems="center">
                                    <Box
                                        borderWidth="2px"
                                        borderColor="white"
                                        borderRadius="full"
                                        width="24px"
                                        height="24px"
                                        mr={3}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Box
                                            bg="white"
                                            borderRadius="full"
                                            width="12px"
                                            height="12px"
                                        />
                                    </Box>
                                    <Text fontSize={textSize} fontWeight="medium">Online payment</Text>
                                </Flex>

                                {/* Payment Logos */}
                                <Flex gap={isMobile ? 1 : 2} alignItems="center">
                                    <Box bg="white" borderRadius="md" p={1} height={paymentIconSize} width={paymentIconWidth} display="flex" alignItems="center" justifyContent="center">
                                        <Text fontSize="xs" fontWeight="bold" color="blue.500">PayPal</Text>
                                    </Box>
                                    <Box bg="white" borderRadius="md" p={1} height={paymentIconSize} width={paymentIconWidth} display="flex" alignItems="center" justifyContent="center">
                                        <Text fontSize="xs" fontWeight="bold" color="gray.700">G Pay</Text>
                                    </Box>
                                    <Box bg="white" borderRadius="md" p={1} height={paymentIconSize} width={paymentIconWidth} display="flex" alignItems="center" justifyContent="center">
                                        <Text fontSize="xs" fontWeight="bold" color="black">Apple</Text>
                                    </Box>
                                    <Box bg="white" borderRadius="md" p={1} height={paymentIconSize} width={paymentIconWidth} display="flex" alignItems="center" justifyContent="center">
                                        <Box position="relative" height="full" width="full">
                                            <Box position="absolute" top="3px" left="5px" width={isMobile ? "16px" : "20px"} height={isMobile ? "16px" : "20px"} bg="red.500" borderRadius="full" />
                                            <Box position="absolute" top="3px" left={isMobile ? "16px" : "20px"} width={isMobile ? "16px" : "20px"} height={isMobile ? "16px" : "20px"} bg="yellow.500" borderRadius="full" opacity={0.8} />
                                        </Box>
                                    </Box>
                                    <Box bg="white" borderRadius="md" p={1} height={paymentIconSize} width={paymentIconWidth} display="flex" alignItems="center" justifyContent="center">
                                        <Text fontSize="xs" fontWeight="bold" color="blue.600">VISA</Text>
                                    </Box>
                                </Flex>
                            </Flex>
                        </Box>

                        {/* Terms and Conditions */}
                        <Flex mb={8} alignItems="flex-start">
                            <Checkbox
                                isChecked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                mr={2}
                                colorScheme="red"
                                size={isMobile ? "sm" : "md"}
                                sx={{
                                    '.chakra-checkbox__control': {
                                        borderColor: termsAccepted ? redHighlightColor : checkboxBorderUncheckedColor,
                                        backgroundColor: termsAccepted ? redHighlightColor : 'transparent',
                                    },
                                }}
                            />
                            <Text color={textColor} fontSize={textSize}>
                                I agree with{' '}
                                <Text
                                    as="span"
                                    color={redHighlightColor}
                                    fontWeight="medium"
                                    cursor="pointer"
                                    _hover={{ color: redHoverColor }}
                                >
                                    general terms and conditions
                                </Text>
                            </Text>
                        </Flex>
                    </Box>

                    {/* Continue Button */}
                    <Flex justifyContent="center" mt={8}>
                        <Button
                            bg={buttonBgColor}
                            color="white"
                            size={buttonSize}
                            px={buttonPadding}
                            py={isMobile ? 5 : 6}
                            width={isMobile ? "100%" : "auto"}
                            // onClick={onOpen}
                            aria-label="Place binding order"
                            isDisabled={!termsAccepted}
                            _hover={{ bg: buttonHoverBgColor }}
                            onClick={handleCreateInspectionSession}

                        >
                            Binding order
                        </Button>
                    </Flex>
                </Box>
            </Box>

            {/* Payment Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size={isMobile ? "full" : "md"} isCentered={!isMobile}>
                <ModalOverlay bg={modalOverlayColor} backdropFilter="blur(5px)" />
                <ModalContent
                    borderRadius={isMobile ? "0" : "md"}
                    p={0}
                    maxW={isMobile ? "100%" : "500px"}
                    bg={modalBgColor}
                    borderWidth="1px"
                    borderColor={modalBorderColor}
                    marginY={isMobile ? "0" : undefined}
                    height={isMobile ? "100%" : "auto"}
                >
                    <ModalHeader p={4} display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid" borderColor={modalBorderColor}>
                        <Flex alignItems="center">
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<ChevronLeft size={16} />}
                                mr={2}
                                onClick={onClose}
                                color={textColor}
                            >
                                Back
                            </Button>
                        </Flex>
                        <Flex justifyContent="center" flex={1}>
                            <Text fontSize="xl" fontWeight="bold" color={redHighlightColor}>Fast4Car</Text>
                        </Flex>
                        <Box>
                            <ModalCloseButton position="static" color={textColor} />
                        </Box>
                    </ModalHeader>
                    <ModalBody p={contentPadding} bg={modalBgColor}>
                        {/* Google Pay Button */}
                        <Button
                            variant="solid"
                            bg="black"
                            color="white"
                            size="lg"
                            width="100%"
                            mb={6}
                            borderRadius="10px"
                            height="50px"
                            _hover={{ color: "gray.500" }}
                        >
                            <Flex alignItems="center" justifyContent="center">
                                <Text fontSize="md" fontWeight="medium" mr={2}>Buy with</Text>
                                <img src='/search.png' width="18px" height="18px" color="white" alt="Google Pay icon" />
                                <Text fontSize="lg" fontWeight="bold" ml={1}>Pay</Text>
                            </Flex>
                        </Button>

                        {/* Or Divider */}
                        <Flex align="center" my={6}>
                            <Divider flex={1} borderColor={dividerColor} />
                            <Text px={4} color={subTextColor} fontSize="sm">or</Text>
                            <Divider flex={1} borderColor={dividerColor} />
                        </Flex>

                        {/* Card Form */}
                        <VStack spacing={6} align="stretch" bg={modalBgColor}>
                            {/* Card Number */}
                            <FormControl>
                                <FormLabel fontSize={textSize} color={formLabelColor}>Card number</FormLabel>
                                <Input
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="Card number"
                                    fontSize={textSize}
                                    height={isMobile ? "44px" : "50px"}
                                    borderColor={inputBorderColor}
                                    focusBorderColor={inputFocusBorderColor}
                                    color={inputColor}
                                    bg={inputBgColor}
                                />
                            </FormControl>

                            {/* Expiry and CVV */}
                            <Flex gap={4} flexDirection={isMobile ? "column" : "row"}>
                                <FormControl flex={1}>
                                    <FormLabel fontSize={textSize} color={formLabelColor}>Expiration date</FormLabel>
                                    <Input
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        placeholder="MM/YY"
                                        fontSize={textSize}
                                        height={isMobile ? "44px" : "50px"}
                                        borderColor={inputBorderColor}
                                        focusBorderColor={inputFocusBorderColor}
                                        color={inputColor}
                                        bg={inputBgColor}
                                    />
                                </FormControl>

                                <FormControl flex={1}>
                                    <FormLabel fontSize={textSize} color={formLabelColor}>CVC/CVV</FormLabel>
                                    <InputGroup>
                                        <Input
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            placeholder="123"
                                            fontSize={textSize}
                                            height={isMobile ? "44px" : "50px"}
                                            borderColor={inputBorderColor}
                                            focusBorderColor={inputFocusBorderColor}
                                            color={inputColor}
                                            bg={inputBgColor}
                                        />
                                        <InputRightElement height={isMobile ? "44px" : "50px"}>
                                            <Image
                                                src="/img/cvv-icon.png"
                                                alt="CVV"
                                                fallback={<Box bg={cvvIconBgColor} w="30px" h="20px" borderRadius="sm" />}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                            </Flex>

                            {/* Save Card Option */}
                            <Box bg={saveCardBgColor} p={4} borderRadius="md" borderWidth={saveCardBorderWidth} borderColor={saveCardBorderColorValue}>
                                <Flex alignItems="flex-start">
                                    <Checkbox
                                        isChecked={saveCard}
                                        onChange={(e) => setSaveCard(e.target.checked)}
                                        mr={3}
                                        colorScheme="red"
                                        size={isMobile ? "sm" : "md"}
                                        sx={{
                                            '.chakra-checkbox__control': {
                                                borderColor: saveCard ? redHighlightColor : saveCardBorderColor,
                                                backgroundColor: saveCard ? redHighlightColor : 'transparent',
                                            },
                                        }}
                                    />
                                    <Box>
                                        <Text fontWeight="medium" fontSize={textSize} color={textColor}>Save card</Text>
                                        <Flex alignItems="center" flexWrap="wrap">
                                            <Text fontSize={isMobile ? "xs" : "sm"} color={subTextColor}>Pay faster and securely via </Text>
                                            <Text fontWeight="bold" mx={1} color={textColor}>GoPay</Text>
                                            <Box w="20px" h="20px" display="inline-flex" alignItems="center" justifyContent="center" bg={gPayBgColor} borderRadius="full" ml={1}>
                                                <Text fontSize="xs" fontWeight="bold" color={gPayTextColor}>G</Text>
                                            </Box>
                                        </Flex>
                                        <Text fontSize={isMobile ? "xs" : "sm"} color={subTextColor}>in thousands of e-shops. <Text as="span" color={learnMoreColor}>Learn more</Text></Text>
                                    </Box>
                                </Flex>
                            </Box>

                            {/* Pay Button */}
                            <Button
                                onClick={handlePaymentSubmit}
                                height={isMobile ? "44px" : "50px"}
                                width="100%"
                                borderRadius="full"
                                bg={redHighlightColor}
                                color="white"
                                _hover={{ bg: paymentButtonHoverBg }}
                                leftIcon={<Lock size={isMobile ? 14 : 16} />}
                                fontSize={textSize}
                            >
                                Pay 119,00 €
                            </Button>

                            {/* Card Logos */}
                            <Flex justifyContent="center" mt={2}>
                                <HStack spacing={4}>
                                    <Box>
                                        <Text fontSize="md" fontWeight="bold" color={useColorModeValue("blue.600", "blue.400")}>VISA</Text>
                                    </Box>
                                    <Box>
                                        <Flex>
                                            <Box w={isMobile ? "18px" : "20px"} h={isMobile ? "18px" : "20px"} bg="red.500" borderRadius="full" />
                                            <Box w={isMobile ? "18px" : "20px"} h={isMobile ? "18px" : "20px"} bg="yellow.500" borderRadius="full" ml="-8px" />
                                        </Flex>
                                    </Box>
                                </HStack>
                            </Flex>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default OrderSummaryContent; 