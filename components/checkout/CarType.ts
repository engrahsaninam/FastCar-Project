export type CarData = {
    image: string;
    title: string;
    mileage: string;
    year: string;
    deliveryInfo: string;
    support: {
        phone: string;
        hours: string;
    };
};

export type Step = {
    id: number;
    label: string;
    isActive: boolean;
};

export type Slide = {
    id: number;
    title: string;
    subTitle?: string;
    content: string;
    price?: string;
    priceLabel?: string;
    tag: string;
    icon: any;
    image: string;
};

export type SlideContentProps = {
    slide: Slide;
    direction: number;
};

export type ControlsProps = {
    current: number;
    total: number;
    onNext: () => void;
    onPrev: () => void;
    onDotClick: (index: number) => void;
};

export type SharedProps = {
    currentSlide: number;
    slides: Slide[];
    nextSlide: () => void;
    prevSlide: () => void;
    setCurrentSlide: (index: number) => void;
    direction: number;
};

export type MobileViewProps = SharedProps & {
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
};

export type DesktopViewProps = SharedProps & {
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
};