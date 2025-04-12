export interface FormData {
    name: string;
    surname: string;
    telephone: string;
    email: string;
    birthDate?: string;
    companyId?: string;
    companyName?: string;
    street?: string;
    houseNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export interface PaymentMethodStepProps {
    selected: string | null;
    onSelect: (value: string) => void;
    applicationSent?: boolean;
}

export interface RadioOptionProps {
    id: string;
    label: string;
    isSelected: boolean;
    onChange: (id: string) => void;
    isDisabled?: boolean;
    applicationSent?: boolean;
}

export interface CarInspectionContentProps {
    isFinancingSelected?: boolean;
    isFinancingApproved?: boolean;
    onContinue?: () => void;
}

export interface ConnectedCarInspectionContentProps {
    onComplete: () => void;
}

export interface ErrorState {
    [key: string]: string;
}

export interface TouchedState {
    [key: string]: boolean;
}

export interface ValidationSchema {
    [key: string]: {
        required?: boolean;
        minLength?: number;
        pattern?: RegExp;
        message?: string;
    };
}