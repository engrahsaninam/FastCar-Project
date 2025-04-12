export interface FinancingData {
    downpayment: number;
    downpaymentPercentage: number;
    installment: number;
    interestRate: number;
    apr: number;
    monthlyPayment: number;
    carPrice: number;
    loanAmount: number;
    totalAmountPaid: number;
    lastPayment: number;
    reservationFee: number;
    checkFee: number;
    borrowedAmount: number;
    partner: string;
}

export interface FinancingOption {
    id: string;
    title: string;
    isNew?: boolean;
    percentage: string;
    description: string;
}

export interface FinancingSpecsProps {
    onFinancingRequest: () => void;
    onFullPayment: () => void;
    onToggleSpecs: (isExpanded: boolean) => void;
}

export interface FinancingUIProps {
    financingData?: FinancingData;
    isApproved?: boolean;
}

export interface FinancingParametersProps {
    downPayment: number;
    downPaymentAmount: number;
    installmentPeriod: number;
    interestRate: string;
    APR: string;
    monthlyPayment: number;
}

export interface FinancingCTAProps {
    heading?: string;
    subText?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    helpText?: string;
    phoneHours?: string;
    phoneNumber?: string;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

export interface ConnectedFinancingUIProps {
    onDecline: () => void;
    onApplicationSubmit: () => void;
}

export interface PaybackPeriodSliderProps {
    paybackPeriod: number;
    onPeriodChange: (period: number) => void;
    selectedOption: string;
}

export interface DownPaymentSliderProps {
    downPayment: number;
    onDownPaymentChange: (percentage: number) => void;
    totalPrice?: number;
    lastPaymentPercentage?: number;
    selectedOption: string;
}