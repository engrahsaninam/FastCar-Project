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
    Center
} from '@chakra-ui/react';
import { Edit2, CreditCard, ChevronLeft, Lock, X } from 'lucide-react';

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
    const [question, setQuestion] = React.useState("");
    const [paymentMethod, setPaymentMethod] = React.useState("online");
    const [termsAccepted, setTermsAccepted] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Payment form state
    const [cardNumber, setCardNumber] = React.useState("1234 1234 1234 1234");
    const [expiryDate, setExpiryDate] = React.useState("MM/YY");
    const [cvv, setCvv] = React.useState("123");
    const [saveCard, setSaveCard] = React.useState(false);

    const handlePaymentSubmit = () => {
        onClose();
        onComplete();
    };

    return (
        <>
            <Box borderRadius="xl" border="1px solid #D3D3D3">
                {/* Main Container */}
                <Box bg="white" p={6}>
                    <Text fontSize="2xl" fontWeight="bold" mb={4} color="navy.800">Order summary</Text>

                    <Divider my={4} borderColor="gray.300" />

                    {/* Billing and Contact Information */}
                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} mb={6}>
                        {/* Billing Data */}
                        <GridItem>
                            <VStack align="stretch" spacing={3}>
                                <Text fontSize="xl" fontWeight="semibold" color="navy.800">Billing/invoice data</Text>
                                <Text color="gray.600" fontSize="sm">Your/your company's details for the tax invoice</Text>
                                <Text color="gray.800" mt={4}>{billingData.address}</Text>
                            </VStack>
                        </GridItem>

                        {/* Contact Data */}
                        <GridItem>
                            <VStack align="stretch" spacing={3}>
                                <Text fontSize="xl" fontWeight="semibold" color="navy.800">Contact data</Text>
                                <Text color="gray.600" fontSize="sm">Contact data, where we can reach you regarding your purchase</Text>

                                <Text fontWeight="medium" mt={2} color="gray.800">{contactData.name}</Text>
                                <Text color="gray.800">{contactData.address}</Text>
                                <Text color="gray.800">{contactData.email}</Text>
                                <Text color="gray.800">{contactData.phone}</Text>
                            </VStack>
                        </GridItem>
                    </Grid>

                    {/* Edit Button */}
                    <Flex justifyContent="flex-end" mb={6}>
                        <Button
                            rightIcon={<Icon as={Edit2} boxSize={4} />}
                            variant="ghost"
                            color="blue.600"
                            _hover={{ bg: "blue.50" }}
                        >
                            Edit the data
                        </Button>
                    </Flex>
                </Box>

                {/* Order Details */}
                <Box bg="white" p={6} borderRadius="xl" mt={6}>
                    <Text fontSize="xl" fontWeight="bold" mb={6} color="navy.800">Summary of your order</Text>

                    {/* Order Line Items */}
                    <Flex justifyContent="space-between" py={4}>
                        <Text fontSize="lg" fontWeight="medium" color="navy.700">CarAudit™</Text>
                        <Text fontSize="lg" fontWeight="medium" color="navy.700">€119</Text>
                    </Flex>

                    {/* Total */}
                    <Box bg="red.50" p={4} borderRadius="md" mb={6}>
                        <Flex justifyContent="space-between">
                            <Text fontSize="lg" fontWeight="semibold" color="red.500">To pay</Text>
                            <Text fontSize="lg" fontWeight="semibold" color="red.500">€119</Text>
                        </Flex>
                    </Box>

                    {/* Description Text */}
                    <Text color="gray.600" mb={8}>
                        After you pay for the car inspection, we will immediately start the inspection and then send you the CarAudit technical report. You can then decide whether to purchase the car.
                    </Text>

                    {/* Question Section */}
                    <VStack align="stretch" spacing={3} mb={8}>
                        <Text fontWeight="bold" color="navy.800" textTransform="uppercase">
                            Do you have a question about the condition or equipment of the vehicle?
                        </Text>
                        <Flex justify="flex-end">
                            <Text fontSize="sm" color="gray.500">0/500</Text>
                        </Flex>
                        <Textarea
                            placeholder="For example, whether there are any requirements the car must meet to be purchased, etc."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            maxLength={500}
                            resize="vertical"
                            h="120px"
                            borderColor="gray.300"
                        />
                    </VStack>

                    {/* Payment Method Section */}
                    <Box mb={8}>
                        <Text fontWeight="bold" mb={4}>
                            Method of payment
                        </Text>
                        <Text color="gray.600" mb={4}>
                            Select your first payment method. The surcharge for the car is then always paid by transfer.
                        </Text>

                        {/* Payment Option */}
                        <Box
                            borderWidth="1px"
                            borderColor="transparent"
                            borderRadius="md"
                            bg="red.500"
                            color="white"
                            p={4}
                            mb={6}
                        >
                            <Flex justifyContent="space-between" alignItems="center">
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
                                    <Text fontSize="xl" fontWeight="medium">Online payment</Text>
                                </Flex>

                                {/* Payment Logos */}
                                <Flex gap={2} alignItems="center">
                                    <Box bg="white" borderRadius="md" p={1} height="30px" width="50px" display="flex" alignItems="center" justifyContent="center">
                                        <Text fontSize="xs" fontWeight="bold" color="blue.500">PayPal</Text>
                                    </Box>
                                    <Box bg="white" borderRadius="md" p={1} height="30px" width="50px" display="flex" alignItems="center" justifyContent="center">
                                        <Text fontSize="xs" fontWeight="bold" color="gray.700">G Pay</Text>
                                    </Box>
                                    <Box bg="white" borderRadius="md" p={1} height="30px" width="50px" display="flex" alignItems="center" justifyContent="center">
                                        <Text fontSize="xs" fontWeight="bold" color="black">Apple</Text>
                                    </Box>
                                    <Box bg="white" borderRadius="md" p={1} height="30px" width="50px" display="flex" alignItems="center" justifyContent="center">
                                        <Box position="relative" height="full" width="full">
                                            <Box position="absolute" top="3px" left="5px" width="20px" height="20px" bg="red.500" borderRadius="full" />
                                            <Box position="absolute" top="3px" left="20px" width="20px" height="20px" bg="yellow.500" borderRadius="full" opacity={0.8} />
                                        </Box>
                                    </Box>
                                    <Box bg="white" borderRadius="md" p={1} height="30px" width="50px" display="flex" alignItems="center" justifyContent="center">
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
                                // size="lg"
                                mr={2}
                                colorScheme="red"
                                size="md"
                                sx={{
                                    '.chakra-checkbox__control': {
                                        borderColor: saveCard ? 'red.500' : 'gray.400',
                                        backgroundColor: saveCard ? 'red.500' : 'transparent',
                                    },
                                }}

                            />
                            <Text>
                                I agree with{' '}
                                <Text
                                    as="span"
                                    color="red.500"
                                    fontWeight="medium"
                                    cursor="pointer"
                                    _hover={{ color: 'red.600' }}
                                    _active={{ color: 'red.600' }}
                                    _focus={{ color: 'red.600' }}
                                >
                                    general terms and conditions
                                </Text>
                            </Text>


                        </Flex>
                    </Box>

                    {/* Continue Button */}
                    <Flex justifyContent="center" mt={8}>
                        <Button
                            bg="red.500"
                            color="white"
                            size="lg"
                            px={12}
                            py={6}
                            onClick={onOpen}
                            aria-label="Place binding order"
                            isDisabled={!termsAccepted}
                            _hover={{ bg: "red.500" }}
                        >
                            Binding order
                        </Button>
                    </Flex>
                </Box>
            </Box>

            {/* Payment Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
                <ModalContent borderRadius="md" p={0} maxW="500px">
                    <ModalHeader p={4} display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid" borderColor="gray.100">
                        <Flex alignItems="center">
                            <Button variant="ghost" size="sm" leftIcon={<ChevronLeft size={16} />} mr={2} onClick={onClose}>
                                Back
                            </Button>
                        </Flex>
                        <Flex justifyContent="center" flex={1}>
                            <Text fontSize="xl" fontWeight="bold" color="red.500">Fast4Car</Text>
                        </Flex>
                        <Box>
                            <ModalCloseButton position="static" />
                        </Box>
                    </ModalHeader>
                    <ModalBody p={6}>
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
                            _hover={{color:"gray.500"}}
                        >
                            <Flex alignItems="center" justifyContent="center">
                                <Text fontSize="md" fontWeight="medium" mr={2}>Buy with</Text>
                                
                                {/* <Text fontSize="lg" fontWeight="bold" color="white.500">o</Text>
                                <Text fontSize="lg" fontWeight="bold" color="yellow.500">o</Text>
                                <Text fontSize="lg" fontWeight="bold" color="blue.500">g</Text>
                                <Text fontSize="lg" fontWeight="bold" color="green.500">l</Text>
                                <Text fontSize="lg" fontWeight="bold" color="white">e</Text> */}
                                <img src='/search.png' width="18px" height="18px" color="white" />
                                <Text fontSize="lg" fontWeight="bold" ml={1}>Pay</Text>
                            </Flex>
                        </Button>

                        {/* Or Divider */}
                        <Flex align="center" my={6}>
                            <Divider flex={1} borderColor="gray.300" />
                            <Text px={4} color="gray.500" fontSize="sm">or</Text>
                            <Divider flex={1} borderColor="gray.300" />
                        </Flex>

                        {/* Card Form */}
                        <VStack spacing={6} align="stretch">
                            {/* Card Number */}
                            <FormControl>
                                <FormLabel fontSize="md" color="gray.600">Card number</FormLabel>
                                <Input
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="Card number"
                                    fontSize="md"
                                    height="50px"
                                    borderColor="gray.300"
                                    focusBorderColor="blue.500"
                                    color="gray.500"
                                />
                            </FormControl>

                            {/* Expiry and CVV */}
                            <Flex gap={4}>
                                <FormControl flex={1}>
                                    <FormLabel fontSize="md" color="gray.600">Expiration date</FormLabel>
                                    <Input
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        placeholder="MM/YY"
                                        fontSize="md"
                                        height="50px"
                                        borderColor="gray.300"
                                        focusBorderColor="blue.500"
                                        color="gray.500"
                                    />
                                </FormControl>

                                <FormControl flex={1}>
                                    <FormLabel fontSize="md" color="gray.600">CVC/CVV</FormLabel>
                                    <InputGroup>
                                        <Input
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            placeholder="123"
                                            fontSize="md"
                                            height="50px"
                                            borderColor="gray.300"
                                            focusBorderColor="blue.500"
                                            color="gray.500"
                                        />
                                        <InputRightElement height="50px">
                                            <Image
                                                src="/img/cvv-icon.png"
                                                alt="CVV"
                                                fallback={<Box bg="gray.100" w="30px" h="20px" borderRadius="sm" />}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                            </Flex>

                            {/* Save Card Option */}
                            <Box bg="gray.50" p={4} borderRadius="md">
                                <Flex alignItems="flex-start">
                                    <Checkbox
                                        isChecked={saveCard}
                                        onChange={(e) => setSaveCard(e.target.checked)}
                                        mr={3}
                                        colorScheme="red"
                                        size="md"
                                        sx={{
                                            '.chakra-checkbox__control': {
                                                borderColor: saveCard ? 'red.500' : 'gray.400',
                                                backgroundColor: saveCard ? 'red.500' : 'transparent',
                                            },
                                        }}
                                    />
                                    <Box>
                                        <Text fontWeight="medium" fontSize="md">Save card</Text>
                                        <Flex alignItems="center">
                                            <Text fontSize="sm" color="gray.600">Pay faster and securely via </Text>
                                            <Text fontWeight="bold" mx={1}>GoPay</Text>
                                            <Box w="20px" h="20px" display="inline-flex" alignItems="center" justifyContent="center" bg="blue.50" borderRadius="full" ml={1}>
                                                <Text fontSize="xs" fontWeight="bold" color="blue.500">G</Text>
                                            </Box>
                                        </Flex>
                                        <Text fontSize="sm" color="gray.600">in thousands of e-shops. <Text as="span" color="blue.500">Learn more</Text></Text>
                                    </Box>
                                </Flex>
                            </Box>

                            {/* Pay Button */}
                            <Button
                                onClick={handlePaymentSubmit}
                                height="50px"
                                width="100%"
                                borderRadius="full"
                                bg="gray.200"
                                color="gray.500"
                                _hover={{ bg: "gray.300" }}
                                leftIcon={<Lock size={16} />}
                            >
                                Pay 119,00 €
                            </Button>

                            {/* Card Logos */}
                            <Flex justifyContent="center" mt={2}>
                                <HStack spacing={4}>
                                    <Box>
                                        <Text fontSize="md" fontWeight="bold" color="blue.600">VISA</Text>
                                    </Box>
                                    <Box>
                                        <Flex>
                                            <Box w="20px" h="20px" bg="red.500" borderRadius="full" />
                                            <Box w="20px" h="20px" bg="yellow.500" borderRadius="full" ml="-8px" />
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