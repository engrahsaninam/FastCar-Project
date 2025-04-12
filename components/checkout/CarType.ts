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
