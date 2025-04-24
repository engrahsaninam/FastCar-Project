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
    Checkbox,
    useColorModeValue,
    useBreakpointValue
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

// Custom hook for breakpoint values
const useBreakpointValues = () => {
    // Text and layout sizes
    const baseSmMd = useBreakpointValue({ base: 'sm', md: 'md' });
    const baseMdLg = useBreakpointValue({ base: 'md', md: 'lg' });
    const baseLgXl = useBreakpointValue({ base: 'lg', md: 'xl' });
    const baseXsSm = useBreakpointValue({ base: 'xs', md: 'sm' });
    const base2xsxs = useBreakpointValue({ base: '2xs', md: 'xs' });
    const baseColumnRow = useBreakpointValue({ base: 'column', md: 'row' }) as "column" | "row";

    // Spacing values
    const base2Md4 = useBreakpointValue({ base: 2, md: 4 });
    const base3Md4 = useBreakpointValue({ base: 3, md: 4 });
    const base4Md6 = useBreakpointValue({ base: 4, md: 6 });
    const base6Md8 = useBreakpointValue({ base: 6, md: 8 });
    const base3Sm0 = useBreakpointValue({ base: 3, sm: 0 });
    const base1Md2 = useBreakpointValue({ base: 1, md: 2 });
    const base5Md6 = useBreakpointValue({ base: 5, md: 6 });
    const base0Sm1 = useBreakpointValue({ base: 0, sm: 1 });

    // Width/height values
    const base20px24px = useBreakpointValue({ base: '20px', md: '24px' });
    const base40px48px = useBreakpointValue({ base: '40px', md: '48px' });
    const base10px12px = useBreakpointValue({ base: '10px', md: '12px' });
    const base28px30px = useBreakpointValue({ base: '28px', md: '30px' });
    const base45px50px = useBreakpointValue({ base: '45px', md: '50px' });
    const base5px = useBreakpointValue({ base: '5px', md: '5px' });
    const base18px20px = useBreakpointValue({ base: '18px', md: '20px' });
    const base16px18px = useBreakpointValue({ base: '16px', md: '18px' });
    const base16px20px = useBreakpointValue({ base: '16px', md: '20px' });
    const base25px30px = useBreakpointValue({ base: '25px', md: '30px' });
    const base14px16px = useBreakpointValue({ base: 14, md: 16 });

    // Layout values
    const baseCenterSmLeft = useBreakpointValue({ base: 'center', sm: 'left' }) as "center" | "left";
    const baseCenterSmFlexEnd = useBreakpointValue({ base: 'center', sm: 'flex-end' });
    const baseFlexStartCenter = useBreakpointValue({ base: 'flex-start', sm: 'center' });
    const base100smAuto = useBreakpointValue({ base: '100%', sm: 'auto' });
    const base95md500px = useBreakpointValue({ base: '95%', md: '500px' });

    return {
        baseSmMd,
        baseMdLg,
        baseLgXl,
        baseXsSm,
        base2xsxs,
        baseColumnRow,
        base2Md4,
        base3Md4,
        base4Md6,
        base6Md8,
        base3Sm0,
        base1Md2,
        base5Md6,
        base0Sm1,
        base20px24px,
        base40px48px,
        base10px12px,
        base28px30px,
        base45px50px,
        base5px,
        base18px20px,
        base16px18px,
        base16px20px,
        base25px30px,
        base14px16px,
        baseCenterSmLeft,
        baseCenterSmFlexEnd,
        baseFlexStartCenter,
        base100smAuto,
        base95md500px
    };
};

const StepOneContent: React.FC = () => {
    // Get all breakpoint values at the component top level
    const breakpointValues = useBreakpointValues();

    // Color mode values
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedTextColor = useColorModeValue("gray.600", "gray.400");
    const lightMutedTextColor = useColorModeValue("gray.500", "gray.500");

    // Status colors
    const redBgLight = useColorModeValue("red.50", "red.900");
    const redTextColor = useColorModeValue("red.500", "red.300");
    const redBorderLight = useColorModeValue("red.100", "red.800");

    const greenBgLight = useColorModeValue("green.50", "green.900");
    const greenTextColor = useColorModeValue("green.500", "green.300");
    const greenBorderLight = useColorModeValue("green.100", "green.800");

    // Payment modal colors
    const modalBg = useColorModeValue("white", "gray.800");
    const modalBorderColor = useColorModeValue("gray.100", "gray.700");
    const googlePayHoverColor = useColorModeValue("gray.500", "gray.400");
    const dividerColor = useColorModeValue("gray.300", "gray.600");
    const formLabelColor = useColorModeValue("gray.600", "gray.400");
    const formBorderColor = useColorModeValue("gray.300", "gray.600");
    const formTextColor = useColorModeValue("gray.500", "gray.300");
    const saveCardBg = useColorModeValue("gray.50", "gray.700");
    const iconBgColor = useColorModeValue("blue.50", "blue.900");
    const iconTextColor = useColorModeValue("blue.500", "blue.300");
    const visaColor = useColorModeValue("blue.600", "blue.300");

    // More color values used in the component
    const checkboxBorderColor = useColorModeValue('gray.400', 'gray.500');
    const activeCheckboxBg = useColorModeValue('red.500', 'red.400');
    const activeCheckboxBorder = useColorModeValue('red.500', 'red.300');
    const greenLightBg = useColorModeValue("green.100", "green.800");

    // Additional shared styles
    const buttonHoverBg = useColorModeValue("red.600", "red.600");
    const buttonBg = useColorModeValue("red.500", "red.500");
    const fallbackImageBg = useColorModeValue("gray.100", "gray.600");

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
                bg={bgColor}
                borderRadius="xl"
                overflow="hidden"
                ref={stepRefs.payment}
                borderWidth="1px"
                borderColor={borderColor}
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
                                <Box mt={6} maxW="100%" overflow="hidden">
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
                bg={bgColor}
                borderRadius="xl"
                overflow="hidden"
                ref={stepRefs.inspection}
                opacity={stepStatuses.inspection === 'locked' ? 0.7 : 1}
                filter={stepStatuses.inspection === 'locked' ? 'grayscale(1)' : 'none'}
                transition="all 0.3s ease"
                borderWidth="1px"
                borderColor={borderColor}
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
                bg={bgColor}
                borderRadius="xl"
                overflow="hidden"
                ref={stepRefs.delivery}
                opacity={stepStatuses.delivery === 'locked' ? 0.7 : 1}
                filter={stepStatuses.delivery === 'locked' ? 'grayscale(1)' : 'none'}
                transition="all 0.3s ease"
                borderWidth="1px"
                borderColor={borderColor}
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
                bg={bgColor}
                borderRadius="xl"
                overflow="hidden"
                ref={stepRefs.additionalServices}
                opacity={stepStatuses.additionalServices === 'locked' ? 0.7 : 1}
                filter={stepStatuses.additionalServices === 'locked' ? 'grayscale(1)' : 'none'}
                transition="all 0.3s ease"
                borderWidth="1px"
                borderColor={borderColor}
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
                bg={bgColor}
                borderRadius="xl"
                overflow="hidden"
                mb={8}
                ref={stepRefs.finalPayment}
                opacity={stepStatuses.finalPayment === 'locked' ? 0.7 : 1}
                filter={stepStatuses.finalPayment === 'locked' ? 'grayscale(1)' : 'none'}
                transition="all 0.3s ease"
                borderWidth="1px"
                borderColor={borderColor}
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
                                bg={greenBgLight}
                                borderRadius="md"
                                alignItems="center"
                                gap={4}
                                border="1px solid"
                                borderColor={greenBorderLight}
                                flexDirection={breakpointValues.baseColumnRow}
                            >
                                <Flex
                                    w={breakpointValues.base40px48px}
                                    h={breakpointValues.base40px48px}
                                    borderRadius="full"
                                    bg={greenLightBg}
                                    alignItems="center"
                                    justifyContent="center"
                                    flexShrink={0}
                                >
                                    <Icon as={Check} color={greenTextColor} boxSize={breakpointValues.base20px24px} />
                                </Flex>
                                <Box textAlign={breakpointValues.baseCenterSmLeft}>
                                    <Text fontWeight="bold" color={greenTextColor} mb={1} fontSize={breakpointValues.baseMdLg}>
                                        Payment Successful
                                    </Text>
                                    <Text fontSize={breakpointValues.baseXsSm} color={textColor}>
                                        Thank you for your purchase. Your order has been confirmed.
                                    </Text>
                                    <Text fontSize={breakpointValues.baseXsSm} color={mutedTextColor} mt={1}>
                                        You will receive a confirmation email with your order details shortly.
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    ) : (
                        <Box p={breakpointValues.base4Md6}>
                            {/* Payment Method Section */}
                            <Box mb={breakpointValues.base6Md8}>
                                <Text fontWeight="bold" mb={breakpointValues.base2Md4} color={textColor} fontSize={breakpointValues.baseMdLg}>
                                    Method of payment
                                </Text>
                                <Text color={mutedTextColor} mb={breakpointValues.base3Md4} fontSize={breakpointValues.baseXsSm}>
                                    Select your payment method to complete the purchase.
                                </Text>

                                {/* Payment Option */}
                                <Box
                                    borderWidth="1px"
                                    borderColor="transparent"
                                    borderRadius="md"
                                    bg={buttonBg}
                                    color="white"
                                    p={breakpointValues.base3Md4}
                                    mb={6}
                                >
                                    <Flex
                                        justifyContent={breakpointValues.baseColumnRow}
                                        alignItems="center"
                                        gap={breakpointValues.base3Sm0}
                                    >
                                        <Flex alignItems="center">
                                            <Box
                                                borderWidth="2px"
                                                borderColor="white"
                                                borderRadius="full"
                                                width={breakpointValues.base20px24px}
                                                height={breakpointValues.base20px24px}
                                                mr={3}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexShrink={0}
                                            >
                                                <Box
                                                    bg="white"
                                                    borderRadius="full"
                                                    width={breakpointValues.base10px12px}
                                                    height={breakpointValues.base10px12px}
                                                />
                                            </Box>
                                            <Text fontSize={breakpointValues.baseMdLg} fontWeight="medium">Online payment</Text>
                                        </Flex>

                                        {/* Payment Logos */}
                                        <Flex
                                            gap={breakpointValues.base1Md2}
                                            alignItems="center"
                                            flexWrap="wrap"
                                            justifyContent={breakpointValues.baseCenterSmFlexEnd}
                                            width={breakpointValues.base100smAuto}
                                        >
                                            <Box bg="white" borderRadius="md" p={1} height={breakpointValues.base28px30px} width={breakpointValues.base45px50px} display="flex" alignItems="center" justifyContent="center">
                                                <Text fontSize={breakpointValues.base2xsxs} fontWeight="bold" color="blue.500">PayPal</Text>
                                            </Box>
                                            <Box bg="white" borderRadius="md" p={1} height={breakpointValues.base28px30px} width={breakpointValues.base45px50px} display="flex" alignItems="center" justifyContent="center">
                                                <Text fontSize={breakpointValues.base2xsxs} fontWeight="bold" color="gray.700">G Pay</Text>
                                            </Box>
                                            <Box bg="white" borderRadius="md" p={1} height={breakpointValues.base28px30px} width={breakpointValues.base45px50px} display="flex" alignItems="center" justifyContent="center">
                                                <Text fontSize={breakpointValues.base2xsxs} fontWeight="bold" color="black">Apple</Text>
                                            </Box>
                                            <Box bg="white" borderRadius="md" p={1} height={breakpointValues.base28px30px} width={breakpointValues.base45px50px} display="flex" alignItems="center" justifyContent="center">
                                                <Box position="relative" height="full" width="full">
                                                    <Box position="absolute" top={breakpointValues.base5px} left={breakpointValues.base5px} width={breakpointValues.base18px20px} height={breakpointValues.base18px20px} bg="red.500" borderRadius="full" />
                                                    <Box position="absolute" top={breakpointValues.base5px} left={breakpointValues.base18px20px} width={breakpointValues.base18px20px} height={breakpointValues.base18px20px} bg="yellow.500" borderRadius="full" opacity={0.8} />
                                                </Box>
                                            </Box>
                                            <Box bg="white" borderRadius="md" p={1} height={breakpointValues.base28px30px} width={breakpointValues.base45px50px} display="flex" alignItems="center" justifyContent="center">
                                                <Text fontSize={breakpointValues.base2xsxs} fontWeight="bold" color="blue.600">VISA</Text>
                                            </Box>
                                        </Flex>
                                    </Flex>
                                </Box>

                                {/* Continue Button */}
                                <Flex justifyContent={breakpointValues.baseCenterSmFlexEnd} mt={breakpointValues.base6Md8}>
                                    <Button
                                        bg={buttonBg}
                                        color="white"
                                        size={breakpointValues.baseMdLg}
                                        px={breakpointValues.base3Md4}
                                        py={breakpointValues.base5Md6}
                                        onClick={openPaymentModal}
                                        aria-label="Process payment"
                                        _hover={{ bg: buttonHoverBg }}
                                        width={breakpointValues.base100smAuto}
                                    >
                                        Process payment
                                    </Button>
                                </Flex>
                            </Box>

                            {/* Payment Modal */}
                            <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} size={breakpointValues.baseXsSm} isCentered>
                                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
                                <ModalContent borderRadius="md" p={0} maxW={breakpointValues.base95md500px} bg={modalBg}>
                                    <ModalHeader p={breakpointValues.base3Md4} display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid" borderColor={modalBorderColor}>
                                        <Flex alignItems="center">
                                            <Button variant="ghost" size={breakpointValues.baseXsSm} leftIcon={<ChevronLeft size={breakpointValues.base14px16px} />} mr={2} onClick={closePaymentModal}>
                                                Back
                                            </Button>
                                        </Flex>
                                        <Flex justifyContent={breakpointValues.baseCenterSmFlexEnd} flex={1}>
                                            <Text fontSize={breakpointValues.baseMdLg} fontWeight="bold" color={redTextColor}>Fast4Car</Text>
                                        </Flex>
                                        <Box>
                                            <ModalCloseButton position="static" />
                                        </Box>
                                    </ModalHeader>
                                    <ModalBody p={breakpointValues.base4Md6}>
                                        {/* Google Pay Button */}
                                        <Button
                                            variant="solid"
                                            bg="black"
                                            color="white"
                                            size={breakpointValues.baseMdLg}
                                            width="100%"
                                            mb={breakpointValues.base4Md6}
                                            borderRadius="10px"
                                            height={breakpointValues.base40px48px}
                                            _hover={{ color: googlePayHoverColor }}
                                        >
                                            <Flex alignItems="center" justifyContent="center">
                                                <Text fontSize={breakpointValues.baseXsSm} fontWeight="medium" mr={2}>Buy with</Text>
                                                <img src='/search.png' width={breakpointValues.base16px18px} height={breakpointValues.base16px18px} color="white" alt="Google Pay icon" />
                                                <Text fontSize={breakpointValues.baseMdLg} fontWeight="bold" ml={1}>Pay</Text>
                                            </Flex>
                                        </Button>

                                        {/* Or Divider */}
                                        <Flex align="center" my={breakpointValues.base4Md6}>
                                            <Divider flex={1} borderColor={dividerColor} />
                                            <Text px={breakpointValues.baseXsSm} color={mutedTextColor} fontSize={breakpointValues.baseXsSm}>or</Text>
                                            <Divider flex={1} borderColor={dividerColor} />
                                        </Flex>

                                        {/* Card Form */}
                                        <VStack spacing={breakpointValues.base4Md6} align={breakpointValues.baseCenterSmLeft}>
                                            {/* Card Number */}
                                            <FormControl>
                                                <FormLabel fontSize={breakpointValues.baseXsSm} color={formLabelColor}>Card number</FormLabel>
                                                <Input
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                    placeholder="Card number"
                                                    fontSize={breakpointValues.baseXsSm}
                                                    height={breakpointValues.base40px48px}
                                                    borderColor={formBorderColor}
                                                    focusBorderColor={redTextColor}
                                                    color={formTextColor}
                                                    bg={bgColor}
                                                />
                                            </FormControl>

                                            {/* Expiry and CVV */}
                                            <Flex gap={breakpointValues.base2Md4} flexDirection={breakpointValues.baseColumnRow}>
                                                <FormControl flex={1}>
                                                    <FormLabel fontSize={breakpointValues.baseXsSm} color={formLabelColor}>Expiration date</FormLabel>
                                                    <Input
                                                        value={expiryDate}
                                                        onChange={(e) => setExpiryDate(e.target.value)}
                                                        placeholder="MM/YY"
                                                        fontSize={breakpointValues.baseXsSm}
                                                        height={breakpointValues.base40px48px}
                                                        borderColor={formBorderColor}
                                                        focusBorderColor={redTextColor}
                                                        color={formTextColor}
                                                        bg={bgColor}
                                                    />
                                                </FormControl>

                                                <FormControl flex={1}>
                                                    <FormLabel fontSize={breakpointValues.baseXsSm} color={formLabelColor}>CVC/CVV</FormLabel>
                                                    <InputGroup>
                                                        <Input
                                                            value={cvv}
                                                            onChange={(e) => setCvv(e.target.value)}
                                                            placeholder="123"
                                                            fontSize={breakpointValues.baseXsSm}
                                                            height={breakpointValues.base40px48px}
                                                            borderColor={formBorderColor}
                                                            focusBorderColor={redTextColor}
                                                            color={formTextColor}
                                                            bg={bgColor}
                                                        />
                                                        <InputRightElement height={breakpointValues.base40px48px}>
                                                            <Image
                                                                src="/img/cvv-icon.png"
                                                                alt="CVV"
                                                                fallback={<Box bg={fallbackImageBg} w={breakpointValues.base25px30px} h={breakpointValues.base16px20px} borderRadius="sm" />}
                                                            />
                                                        </InputRightElement>
                                                    </InputGroup>
                                                </FormControl>
                                            </Flex>

                                            {/* Save Card Option */}
                                            <Box bg={saveCardBg} p={breakpointValues.base3Md4} borderRadius="md">
                                                <Flex alignItems="flex-start" flexDirection={breakpointValues.baseColumnRow} gap={breakpointValues.base3Sm0}>
                                                    <Checkbox
                                                        isChecked={saveCard}
                                                        onChange={(e) => setSaveCard(e.target.checked)}
                                                        mr={3}
                                                        colorScheme="red"
                                                        size={breakpointValues.baseXsSm}
                                                        sx={{
                                                            '.chakra-checkbox__control': {
                                                                borderColor: saveCard ? activeCheckboxBorder : checkboxBorderColor,
                                                                backgroundColor: saveCard ? activeCheckboxBg : 'transparent',
                                                            },
                                                        }}
                                                        alignSelf={breakpointValues.baseFlexStartCenter}
                                                        mt={breakpointValues.base0Sm1}
                                                    />
                                                    <Box>
                                                        <Text fontWeight="medium" fontSize={breakpointValues.baseXsSm} color={textColor}>Save card</Text>
                                                        <Flex alignItems="center" flexWrap="wrap">
                                                            <Text fontSize={breakpointValues.baseXsSm} color={mutedTextColor}>Pay faster and securely via </Text>
                                                            <Text fontWeight="bold" mx={1} color={textColor} fontSize={breakpointValues.baseXsSm}>GoPay</Text>
                                                            <Box w={breakpointValues.base16px20px} h={breakpointValues.base16px20px} display="inline-flex" alignItems="center" justifyContent="center" bg={iconBgColor} borderRadius="full" ml={1}>
                                                                <Text fontSize={breakpointValues.base2xsxs} fontWeight="bold" color={iconTextColor}>G</Text>
                                                            </Box>
                                                        </Flex>
                                                        <Text fontSize={breakpointValues.baseXsSm} color={mutedTextColor}>in thousands of e-shops. <Text as="span" color={redTextColor}>Learn more</Text></Text>
                                                    </Box>
                                                </Flex>
                                            </Box>

                                            {/* Pay Button */}
                                            <Button
                                                onClick={handleFinalPaymentComplete}
                                                height={breakpointValues.base40px48px}
                                                width="100%"
                                                borderRadius="full"
                                                bg={buttonBg}
                                                color="white"
                                                _hover={{ bg: buttonHoverBg }}
                                                leftIcon={<Lock size={breakpointValues.base14px16px} />}
                                                fontSize={breakpointValues.baseXsSm}
                                            >
                                                Pay 119,00 €
                                            </Button>

                                            {/* Card Logos */}
                                            <Flex justifyContent={breakpointValues.baseCenterSmFlexEnd} mt={breakpointValues.base1Md2}>
                                                <HStack spacing={breakpointValues.base4Md6}>
                                                    <Box>
                                                        <Text fontSize={breakpointValues.baseXsSm} fontWeight="bold" color={visaColor}>VISA</Text>
                                                    </Box>
                                                    <Box>
                                                        <Flex>
                                                            <Box w={breakpointValues.base16px18px} h={breakpointValues.base16px18px} bg="red.500" borderRadius="full" />
                                                            <Box w={breakpointValues.base16px18px} h={breakpointValues.base16px18px} bg="yellow.500" borderRadius="full" ml="-8px" />
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