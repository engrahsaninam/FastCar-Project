import React from 'react';
import { Box } from '@chakra-ui/react';
import FinancingSpecs from './FinancingSpecs';
import FinancingForm from './FinancingForm';

interface ConnectedFinancingUIProps {
    onDecline: () => void;
    onApplicationSubmit: () => void;
}

const ConnectedFinancingUI: React.FC<ConnectedFinancingUIProps> = ({
    onDecline,
    onApplicationSubmit
}) => {
    return (
        <Box>
            <FinancingForm
                onSubmit={onApplicationSubmit}
                // onDecline={onDecline}
            />
        </Box>
    );
};

export default ConnectedFinancingUI; 