import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import StepHeader from './Common/StepHeader';
import StepItem from './Common/StepItem';
import StepContent from './Common/StepContent';
import PaymentMethodStep from './PaymentMethod/PaymentMethodStep';
import FinancingCTASection from './PaymentMethod/FinancingCTASection';
import FinancingSpecs from './PaymentMethod/FinancingSpecs';
import FinancingForm from './PaymentMethod/FinancingForm';

const StepOneContent: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [applicationSent, setApplicationSent] = useState(false);
    const [showSpecs, setShowSpecs] = useState(false);
    const [showFinancingForm, setShowFinancingForm] = useState(false);

    const handlePaymentMethodSelect = (value: string) => {
        setSelectedPaymentMethod(value);
        if (value !== 'financing') {
            setShowFinancingForm(false);
            setApplicationSent(false);
        }
    };

    const handleFinancingSubmit = () => {
        setApplicationSent(true);
    };

    const handlePayInFull = () => {
        setSelectedPaymentMethod('bank-transfer');
    };

    const handleToggleSpecs = () => {
        setShowSpecs(!showSpecs);
    };

    const handleWantFinancing = () => {
        setShowFinancingForm(true);
    };

    return (
        <Box
            bg="white"
            borderRadius="xl"
            overflow="hidden"
            mt={8}
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
                isActive={isExpanded}
                onClick={setIsExpanded}
                isCompleted={!!selectedPaymentMethod}
            />

            <StepContent isActive={isExpanded}>
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
    );
};

export default StepOneContent;