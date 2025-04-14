import React, { useState, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import StepHeader from './Common/StepHeader';
import StepItem from './Common/StepItem';
import StepContent from './Common/StepContent';
import PaymentMethodStep from './PaymentMethod/PaymentMethodStep';
import FinancingCTASection from './PaymentMethod/FinancingCTASection';
import FinancingSpecs from './PaymentMethod/FinancingSpecs';
import FinancingForm from './PaymentMethod/FinancingForm';
import CarInspectionContent from './CarInspection/CarInspectionContent';
import ConnectedCarInspectionContent from './CarInspection/ConnectedCarInspectionContent';
import DeliveryContent from './Delivery/DeliveryContent';
import AdditionalServicesContent from './AdditionalServices/AdditionalServicesContent';

const StepOneContent: React.FC = () => {
    const [isStep1Expanded, setIsStep1Expanded] = useState(true);
    const [isStep2Expanded, setIsStep2Expanded] = useState(true);
    const [isStep3Expanded, setIsStep3Expanded] = useState(true);
    const [isStep5Expanded, setIsStep5Expanded] = useState(true);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [applicationSent, setApplicationSent] = useState(false);
    const [showSpecs, setShowSpecs] = useState(false);
    const [showFinancingForm, setShowFinancingForm] = useState(false);
    const [showStep2, setShowStep2] = useState(false);
    const [showStep3, setShowStep3] = useState(false);
    const [showStep5, setShowStep5] = useState(false);
    const [isFinancingApproved, setIsFinancingApproved] = useState(false);
    const [showBillingAddress, setShowBillingAddress] = useState(false);

    // Add ref for step 1
    const step1Ref = useRef<HTMLDivElement>(null);

    // Add scroll to step 1 function
    const scrollToStep1 = () => {
        setTimeout(() => {
            if (step1Ref.current) {
                step1Ref.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    };

    const handlePaymentMethodSelect = (value: string) => {
        setSelectedPaymentMethod(value);
        if (value === 'bank-transfer') {
            setShowStep2(true);
            setShowBillingAddress(true);
            scrollToStep1();
        }
        if (value !== 'financing') {
            setShowFinancingForm(false);
            setApplicationSent(false);
        }
    };

    const handleFinancingSubmit = () => {
        setApplicationSent(true);
        scrollToStep1();
    };

    const handlePayInFull = () => {
        setSelectedPaymentMethod('bank-transfer');
        setShowStep2(true);
        setShowBillingAddress(true);
        scrollToStep1();
    };

    const handleToggleSpecs = () => {
        setShowSpecs(!showSpecs);
    };

    const handleWantFinancing = () => {
        setShowFinancingForm(true);
    };

    const handleBillingComplete = () => {
        handleContinueFromInspection();
        scrollToStep1();
    };

    const handleContinueFromInspection = () => {
        setShowStep3(true);
        scrollToStep1();
    };

    const handleContinueFromDelivery = () => {
        setShowStep5(true);
        scrollToStep1();
    };

    const handleContinueFromAdditionalServices = () => {
        // Handle continue from additional services
        scrollToStep1();
    };

    return (
        <>
            <Box
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                mt={8}
                ref={step1Ref}
            >
                <Box p={6}>
                    <StepHeader
                        step="Step 1"
                        title="Payment Method"
                        isLocked={false}
                        isActive={true}
                    />
                </Box>

                <StepItem
                    title="Financing or wire transfer?"
                    isLocked={false}
                    isFirst={true}
                    showChevron={true}
                    isActive={isStep1Expanded}
                    onClick={setIsStep1Expanded}
                    isCompleted={!selectedPaymentMethod}
                />

                <StepContent isActive={isStep1Expanded}>
                    <Box p={6} pt={2}>
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
                                        onSecondaryClick={handlePayInFull}
                                    />
                                </Box>

                                {showFinancingForm && (
                                    <Box mt={6}>
                                        <FinancingForm
                                            onSubmit={handleFinancingSubmit}
                                            onDecline={handlePayInFull}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </StepContent>
            </Box>

            {/* Step 2 */}
            {showStep2 && (
                <Box
                    bg="white"
                    borderRadius="xl"
                    overflow="hidden"
                    mt={8}
                >
                    <Box p={6}>
                        <StepHeader
                            step="Step 2"
                            title="Car Inspection"
                            isLocked={false}
                            isActive={true}
                        />
                    </Box>

                    <StepItem
                        title="CarAudit™ vehicle inspection"
                        isLocked={false}
                        isFirst={true}
                        showChevron={true}
                        isActive={isStep2Expanded}
                        onClick={setIsStep2Expanded}
                        isCompleted={false}
                    />

                    <StepContent isActive={isStep2Expanded}>
                        <Box p={6} pt={2}>
                            <CarInspectionContent
                                isFinancingSelected={selectedPaymentMethod === 'financing'}
                                isFinancingApproved={isFinancingApproved}
                                onContinue={handleContinueFromInspection}
                            />
                            {showBillingAddress && (
                                <ConnectedCarInspectionContent
                                    onComplete={handleBillingComplete}
                                />
                            )}
                        </Box>
                    </StepContent>
                </Box>
            )}

            {/* Step 3 */}
            {showStep3 && (
                <Box
                    bg="white"
                    borderRadius="xl"
                    overflow="hidden"
                    mt={8}
                >
                    <Box p={6}>
                        <StepHeader
                            step="Step 3"
                            title="Delivery"
                            isLocked={false}
                            isActive={true}
                        />
                    </Box>

                    <StepItem
                        title="Delivery"
                        isLocked={false}
                        isFirst={true}
                        showChevron={true}
                        isActive={isStep3Expanded}
                        onClick={setIsStep3Expanded}
                        isCompleted={false}
                    />

                    <StepContent isActive={isStep3Expanded}>
                        <Box p={6} pt={2}>
                            <DeliveryContent
                                onContinue={handleContinueFromDelivery}
                            />
                        </Box>
                    </StepContent>
                </Box>
            )}

            {/* Step 5: Additional Services */}
            {showStep5 && (
                <Box
                    bg="white"
                    borderRadius="xl"
                    overflow="hidden"
                    mt={8}
                >
                    <Box p={6}>
                        <StepHeader
                            step="Step 4"
                            title="Additional Services"
                            isLocked={false}
                            isActive={true}
                        />
                    </Box>

                    <StepItem
                        title="Choose Additional Services"
                        isLocked={false}
                        isFirst={true}
                        showChevron={true}
                        isActive={isStep5Expanded}
                        onClick={setIsStep5Expanded}
                        isCompleted={false}
                    />

                    <StepContent isActive={isStep5Expanded}>
                        <AdditionalServicesContent
                            onContinue={handleContinueFromAdditionalServices}
                        />
                    </StepContent>
                </Box>
            )}
        </>
    );
};

export default StepOneContent;