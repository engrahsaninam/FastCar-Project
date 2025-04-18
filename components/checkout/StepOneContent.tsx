import React, { useState, useRef } from 'react';
import { Box, Flex, Text, Icon } from '@chakra-ui/react';
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
import PaymentContent from './Payment/PaymentContent';
import { Check, Clock } from 'lucide-react';

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

    const handlePaymentConfirm = () => {
        // Handle payment confirmation
        updateStepStatus('finalPayment', 'completed');
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
                                            All you have to do now is wait, usually a request takes us 24 hours to process
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
                    <PaymentContent
                        onConfirm={handlePaymentConfirm}
                    />
                </StepContent>
            </Box>
        </Box>
    );
};

export default StepOneContent;