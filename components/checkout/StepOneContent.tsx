import React, { useState, useRef } from 'react';
import {
    Box,
    Flex,
    Text,
    Icon,
    Button,
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
    VStack,
    HStack,
    Divider,
    Center,
    Image,
    Checkbox
} from '@chakra-ui/react';
import StepHeader from './Common/StepHeader';
import StepItem from './Common/StepItem';
import StepContent from './Common/StepContent';
import PaymentMethodStep from './PaymentMethod/PaymentMethodStep';
import FinancingCTASection from './PaymentMethod/FinancingCTASection';
import FinancingSpecs from './PaymentMethod/FinancingSpecs';
import FinancingForm from './PaymentMethod/FinancingForm';
import CarInspectionContent from './CarInspection/CarInspectionContent';
import ConnectedCarInspectionContent from './CarInspection/ConnectedCarInspectionContent';
import OrderSummaryContent from './CarInspection/OrderSummaryContent';
import DeliveryContent from './Delivery/DeliveryContent';
import AdditionalServicesContent from './AdditionalServices/AdditionalServicesContent';
import { Check, Clock, ChevronLeft, Lock } from 'lucide-react';

// Define available steps with typings
type StepStatus = 'locked' | 'active' | 'completed';
type StepKey = 'payment' | 'inspection' | 'delivery' | 'additionalServices' | 'finalPayment';

const StepOneContent: React.FC = () => {
    // Track the current active step
    const [activeStep, setActiveStep] = useState<StepKey>('payment');

    // Track the step statuses
    const [stepStatuses, setStepStatuses] = useState<Record<StepKey, StepStatus>>({
        payment: 'active',
        inspection: 'locked',
        delivery: 'locked',
        additionalServices: 'locked',
        finalPayment: 'locked'
    });

    // Track step expansions - all steps visible but only first one expanded
    const [isStep1Expanded, setIsStep1Expanded] = useState(true);
    const [isStep2Expanded, setIsStep2Expanded] = useState(false);
    const [isStep3Expanded, setIsStep3Expanded] = useState(false);
    const [isStep4Expanded, setIsStep4Expanded] = useState(false);
    const [isStep5Expanded, setIsStep5Expanded] = useState(false);

    // Track data for payment step
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [applicationSent, setApplicationSent] = useState(false);
    const [showSpecs, setShowSpecs] = useState(false);
    const [showFinancingForm, setShowFinancingForm] = useState(false);
    const [isFinancingApproved, setIsFinancingApproved] = useState(false);
    const [showBillingAddress, setShowBillingAddress] = useState(false);

    // Track inspection step data
    const [showOrderSummary, setShowOrderSummary] = useState(false);

    // Track final payment data
    const [finalPaymentComplete, setFinalPaymentComplete] = useState(false);
    const { isOpen: isPaymentModalOpen, onOpen: openPaymentModal, onClose: closePaymentModal } = useDisclosure();

    // Payment form state
    const [cardNumber, setCardNumber] = useState("1234 1234 1234 1234");
    const [expiryDate, setExpiryDate] = useState("MM/YY");
    const [cvv, setCvv] = useState("123");
    const [saveCard, setSaveCard] = useState(false);

    // Add ref for scrolling
    const stepRefs = {
        payment: useRef<HTMLDivElement>(null),
        inspection: useRef<HTMLDivElement>(null),
        delivery: useRef<HTMLDivElement>(null),
        additionalServices: useRef<HTMLDivElement>(null),
        finalPayment: useRef<HTMLDivElement>(null)
    };

    // Helper to scroll to a step
    const scrollToStep = (step: StepKey) => {
        setTimeout(() => {
            if (stepRefs[step]?.current) {
                stepRefs[step].current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    };

    // Helper to update step status
    const updateStepStatus = (step: StepKey, status: StepStatus) => {
        setStepStatuses(prev => ({
            ...prev,
            [step]: status
        }));
    };

    // Helper to move to next step
    const moveToNextStep = (currentStep: StepKey, nextStep: StepKey) => {
        updateStepStatus(currentStep, 'completed');
        updateStepStatus(nextStep, 'active');
        setActiveStep(nextStep);

        // Expand the next step and collapse others if not needed
        switch (nextStep) {
            case 'inspection':
                setIsStep2Expanded(true);
                break;
            case 'delivery':
                setIsStep3Expanded(true);
                break;
            case 'additionalServices':
                setIsStep4Expanded(true);
                break;
            case 'finalPayment':
                setIsStep5Expanded(true);
                break;
        }

        scrollToStep(nextStep);
    };

    const handlePaymentMethodSelect = (value: string) => {
        setSelectedPaymentMethod(value);
        if (value === 'bank-transfer') {
            setShowBillingAddress(true);
            moveToNextStep('payment', 'inspection');
        }
        if (value !== 'financing') {
            setShowFinancingForm(false);
            setApplicationSent(false);
        }
    };

    const handleFinancingSubmit = () => {
        setApplicationSent(true);
        setIsFinancingApproved(true);
        setShowFinancingForm(false);
        moveToNextStep('payment', 'inspection');
    };

    const handlePayInFull = () => {
        setSelectedPaymentMethod('bank-transfer');
        setShowBillingAddress(true);
        moveToNextStep('payment', 'inspection');
    };

    const handleToggleSpecs = () => {
        setShowSpecs(!showSpecs);
    };

    const handleWantFinancing = () => {
        setShowFinancingForm(true);
    };

    const handleBillingComplete = () => {
        // Show order summary when billing details are confirmed
        setShowOrderSummary(true);
    };

    const handleOrderSummaryComplete = () => {
        // Move to delivery step after order summary is confirmed
        moveToNextStep('inspection', 'delivery');
    };

    const handleContinueFromInspection = () => {
        moveToNextStep('inspection', 'delivery');
    };

    const handleContinueFromDelivery = () => {
        moveToNextStep('delivery', 'additionalServices');
    };

    const handleContinueFromAdditionalServices = () => {
        moveToNextStep('additionalServices', 'finalPayment');
    };

    const handleFinalPaymentComplete = () => {
        // Handle final payment confirmation
        closePaymentModal();
        updateStepStatus('finalPayment', 'completed');
        setFinalPaymentComplete(true);
        console.log('Payment confirmed');
    };

    return (
        <Box display="flex" flexDirection="column" gap={8}>
            {/* Step 1: Payment Method */}
            <Box
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                ref={stepRefs.payment}
            >
                <Box p={6}>
                    <StepHeader
                        step="Step 1"
                        title="Payment Method"
                        isLocked={stepStatuses.payment === 'locked'}
                        isActive={stepStatuses.payment === 'active'}
                    />
                </Box>

                <StepItem
                    title="Financing or wire transfer?"
                    isLocked={stepStatuses.payment === 'locked'}
                    isFirst={true}
                    showChevron={true}
                    isActive={isStep1Expanded}
                    onClick={() => stepStatuses.payment !== 'locked' && setIsStep1Expanded(!isStep1Expanded)}
                    isCompleted={stepStatuses.payment === 'completed'}
                />

                <StepContent isActive={isStep1Expanded && stepStatuses.payment !== 'locked'}>
                    <Box p={6} pt={2}>
                        {selectedPaymentMethod === 'financing' && applicationSent ? (
                            <Box mb={6}>
                                {/* Application Sent Status */}
                                <Flex
                                    p={4}
                                    bg="red.50"
                                    borderRadius="md"
                                    alignItems="center"
                                    gap={4}
                                    mb={6}
                                    border="1px solid"
                                    borderColor="red.100"
                                >
                                    <Flex
                                        w="48px"
                                        h="48px"
                                        borderRadius="full"
                                        bg="red.100"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Icon as={Clock} color="red.500" boxSize="24px" />
                                    </Flex>
                                    <Box>
                                        <Text fontWeight="bold" color="red.500" mb={1}>
                                            Application sent
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Your request for financing is being processed
                                        </Text>
                                        <Text fontSize="xs" color="#718096" mt={1}>
                                            You'll hear from us within 24 hours
                                        </Text>
                                    </Box>
                                </Flex>
                            </Box>
                        ) : null}

                        <PaymentMethodStep
                            selected={selectedPaymentMethod}
                            onSelect={handlePaymentMethodSelect}
                            applicationSent={applicationSent}
                        />

                        {selectedPaymentMethod === 'financing' && !applicationSent && (
                            <>
                                <Box mt={6}>
                                    <FinancingSpecs
                                        onFinancingRequest={handleWantFinancing}
                                        onFullPayment={handlePayInFull}
                                        onToggleSpecs={handleToggleSpecs}
                                    />
                                </Box>

                                <Box mt={6}>
                                    <FinancingCTASection
                                        onPrimaryClick={handleWantFinancing}
                                    />
                                </Box>

                                {showFinancingForm && (
                                    <Box mt={6}>
                                        <FinancingForm
                                            onSubmit={handleFinancingSubmit}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </StepContent>
            </Box>

            {/* Step 2: Car Inspection */}
            <Box
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                ref={stepRefs.inspection}
                opacity={stepStatuses.inspection === 'locked' ? 0.7 : 1}
                filter={stepStatuses.inspection === 'locked' ? 'grayscale(1)' : 'none'}
                transition="all 0.3s ease"
            >
                <Box p={6}>
                    <StepHeader
                        step="Step 2"
                        title="Car Inspection"
                        isLocked={stepStatuses.inspection === 'locked'}
                        isActive={stepStatuses.inspection === 'active'}
                    />
                </Box>

                <StepItem
                    title="CarAudit™ vehicle inspection"
                    isLocked={stepStatuses.inspection === 'locked'}
                    isFirst={true}
                    showChevron={true}
                    isActive={isStep2Expanded}
                    onClick={() => stepStatuses.inspection !== 'locked' && setIsStep2Expanded(!isStep2Expanded)}
                    isCompleted={stepStatuses.inspection === 'completed'}
                />

                <StepContent isActive={isStep2Expanded && stepStatuses.inspection !== 'locked'}>
                    <Box p={6} pt={2}>
                        <CarInspectionContent
                            isFinancingSelected={selectedPaymentMethod === 'financing'}
                            isFinancingApproved={isFinancingApproved}
                        />
                    </Box>

                    {showBillingAddress && !showOrderSummary && (
                        <ConnectedCarInspectionContent
                            onComplete={handleBillingComplete}
                        />
                    )}

                    {showOrderSummary && (
                        <Box px={6} pb={6}>
                            <OrderSummaryContent
                                onComplete={handleOrderSummaryComplete}
                            />
                        </Box>
                    )}
                </StepContent>
            </Box>

            {/* Step 3: Delivery */}
            <Box
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                ref={stepRefs.delivery}
                opacity={stepStatuses.delivery === 'locked' ? 0.7 : 1}
                filter={stepStatuses.delivery === 'locked' ? 'grayscale(1)' : 'none'}
                transition="all 0.3s ease"
            >
                <Box p={6}>
                    <StepHeader
                        step="Step 3"
                        title="Delivery"
                        isLocked={stepStatuses.delivery === 'locked'}
                        isActive={stepStatuses.delivery === 'active'}
                    />
                </Box>

                <StepItem
                    title="Delivery"
                    isLocked={stepStatuses.delivery === 'locked'}
                    isFirst={true}
                    showChevron={true}
                    isActive={isStep3Expanded}
                    onClick={() => stepStatuses.delivery !== 'locked' && setIsStep3Expanded(!isStep3Expanded)}
                    isCompleted={stepStatuses.delivery === 'completed'}
                />

                <StepContent isActive={isStep3Expanded && stepStatuses.delivery !== 'locked'}>
                    <Box p={6} pt={2}>
                        <DeliveryContent
                            onContinue={handleContinueFromDelivery}
                        />
                    </Box>
                </StepContent>
            </Box>

            {/* Step 4: Additional Services */}
            <Box
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                ref={stepRefs.additionalServices}
                opacity={stepStatuses.additionalServices === 'locked' ? 0.7 : 1}
                filter={stepStatuses.additionalServices === 'locked' ? 'grayscale(1)' : 'none'}
                transition="all 0.3s ease"
            >
                <Box p={6}>
                    <StepHeader
                        step="Step 4"
                        title="Additional Services"
                        isLocked={stepStatuses.additionalServices === 'locked'}
                        isActive={stepStatuses.additionalServices === 'active'}
                    />
                </Box>

                <StepItem
                    title="Choose Additional Services"
                    isLocked={stepStatuses.additionalServices === 'locked'}
                    isFirst={true}
                    showChevron={true}
                    isActive={isStep4Expanded}
                    onClick={() => stepStatuses.additionalServices !== 'locked' && setIsStep4Expanded(!isStep4Expanded)}
                    isCompleted={stepStatuses.additionalServices === 'completed'}
                />

                <StepContent isActive={isStep4Expanded && stepStatuses.additionalServices !== 'locked'}>
                    <AdditionalServicesContent
                        onContinue={handleContinueFromAdditionalServices}
                    />
                </StepContent>
            </Box>

            {/* Step 5: Payment */}
            <Box
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                mb={8}
                ref={stepRefs.finalPayment}
                opacity={stepStatuses.finalPayment === 'locked' ? 0.7 : 1}
                filter={stepStatuses.finalPayment === 'locked' ? 'grayscale(1)' : 'none'}
                transition="all 0.3s ease"
            >
                <Box p={6}>
                    <StepHeader
                        step="Step 5"
                        title="Payment"
                        isLocked={stepStatuses.finalPayment === 'locked'}
                        isActive={stepStatuses.finalPayment === 'active'}
                    />
                </Box>

                <StepItem
                    title="Complete Payment"
                    isLocked={stepStatuses.finalPayment === 'locked'}
                    isFirst={true}
                    showChevron={true}
                    isActive={isStep5Expanded}
                    onClick={() => stepStatuses.finalPayment !== 'locked' && setIsStep5Expanded(!isStep5Expanded)}
                    isCompleted={stepStatuses.finalPayment === 'completed'}
                />

                <StepContent isActive={isStep5Expanded && stepStatuses.finalPayment !== 'locked'}>
                    {finalPaymentComplete ? (
                        <Box p={6}>
                            <Flex
                                p={6}
                                bg="green.50"
                                borderRadius="md"
                                alignItems="center"
                                gap={4}
                                border="1px solid"
                                borderColor="green.100"
                            >
                                <Flex
                                    w="48px"
                                    h="48px"
                                    borderRadius="full"
                                    bg="green.100"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Icon as={Check} color="green.500" boxSize="24px" />
                                </Flex>
                                <Box>
                                    <Text fontWeight="bold" color="green.500" mb={1}>
                                        Payment Successful
                                    </Text>
                                    <Text fontSize="sm" color="gray.700">
                                        Thank you for your purchase. Your order has been confirmed.
                                    </Text>
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        You will receive a confirmation email with your order details shortly.
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    ) : (
                        <Box p={6}>
                            {/* Payment Method Section */}
                            <Box mb={8}>
                                <Text fontWeight="bold" mb={4}>
                                    Method of payment
                                </Text>
                                <Text color="gray.600" mb={4}>
                                    Select your payment method to complete the purchase.
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

                                {/* Continue Button */}
                                <Flex justifyContent="center" mt={8}>
                                    <Button
                                        bg="red.500"
                                        color="white"
                                        size="lg"
                                        px={12}
                                        py={6}
                                        onClick={openPaymentModal}
                                        aria-label="Process payment"
                                        _hover={{ bg: "red.600" }}
                                    >
                                        Process payment
                                    </Button>
                                </Flex>
                            </Box>

                            {/* Payment Modal */}
                            <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} size="md" isCentered>
                                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
                                <ModalContent borderRadius="md" p={0} maxW="500px">
                                    <ModalHeader p={4} display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid" borderColor="gray.100">
                                        <Flex alignItems="center">
                                            <Button variant="ghost" size="sm" leftIcon={<ChevronLeft size={16} />} mr={2} onClick={closePaymentModal}>
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
                                            _hover={{ color: "gray.500" }}
                                        >
                                            <Flex alignItems="center" justifyContent="center">
                                                <Text fontSize="md" fontWeight="medium" mr={2}>Buy with</Text>
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
                                                    focusBorderColor="red.500"
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
                                                        focusBorderColor="red.500"
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
                                                            focusBorderColor="red.500"
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
                                                        <Text fontSize="sm" color="gray.600">in thousands of e-shops. <Text as="span" color="red.500">Learn more</Text></Text>
                                                    </Box>
                                                </Flex>
                                            </Box>

                                            {/* Pay Button */}
                                            <Button
                                                onClick={handleFinalPaymentComplete}
                                                height="50px"
                                                width="100%"
                                                borderRadius="full"
                                                bg="red.500"
                                                color="white"
                                                _hover={{ bg: "red.600" }}
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
                        </Box>
                    )}
                </StepContent>
            </Box>
        </Box>
    );
};

export default StepOneContent;