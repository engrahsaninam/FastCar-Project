export interface Vehicle {
    id: number;
    name: string;
    power: string;
    basePrice: number;
    priceWithoutVAT: number;
    services: {
        carAudit: number;
        homeDelivery: number;
        importMOT: number;
        adminFee: number;
        registration: number;
    };
}

export interface Order {
    id: string;
    vehicle: string;
    customer: string;
    customerEmail: string;
    customerPhone: string;
    status: string;
    totalPrice: number;
    services: string[];
    date: string;
    paymentStatus: string;
    deliveryAddress: string;
    notes: string;
    timeline: Array<{
        status: string;
        date: string;
        time: string;
    }>;
}

export interface Stats {
    totalVehicles: number;
    activeOrders: number;
    totalRevenue: number;
    pendingDeliveries: number;
}
