import { IconType } from 'react-icons';

export interface Step {
    id: number;
    step: string;
    title: string;
    icon: IconType;
    isLocked: boolean;
    items: StepItem[];
}

export interface StepItem {
    id: string;
    title: string;
    badge?: string;
}

export interface StepHeaderProps {
    step: string;
    title: string;
    isLocked: boolean;
    isActive: boolean;
}

export interface StepItemProps {
    title: string;
    badge?: string;
    isLocked: boolean;
    isFirst: boolean;
    showChevron: boolean;
    isActive: boolean;
    isCompleted: boolean;
    onClick?: (isExpanded: boolean) => void;
}

export interface StepContentProps {
    children: React.ReactNode;
    isActive: boolean;
}