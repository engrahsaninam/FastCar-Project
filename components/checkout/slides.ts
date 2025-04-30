import { Info, CreditCard, Car, Shield, FileText } from 'lucide-react';

export const slides = [
    {
        id: 1,
        title: "How to Make a Purchase",
        icon: Info,
        tag: "Overview",
        content: "You're just a few steps away from owning your new car! The total price includes everything MOT, registration, and delivery. No hidden fees or surprises, unless you choose additional services.",
        image: "/1.png",
    },
    {
        id: 2,
        title: "Payment Method",
        icon: CreditCard,
        tag: "Step 1",
        subTitle: "Secure Payment",
        price: "EUR 567,265",
        priceLabel: "TOTAL PRICE INCLUDING ALL SERVICES",
        content: "Select your preferred payment method for a smooth and secure transaction.",
        image: "/2.png",
    },
    {
        id: 3,
        title: "Car Inspection",
        icon: Car,
        tag: "Step 2",
        subTitle: "Thorough Check",
        content: "Get a full technical report on the car's condition for EUR 1,990. Our comprehensive inspection ensures transparency and helps you make an informed decision.",
        image: "/3.png",
    },
    {
        id: 4,
        title: "Warranty Coverage",
        icon: Shield,
        tag: "Step 3",
        subTitle: "Complete Protection",
        content: "Enjoy full warranty coverage when purchasing through us. Contracts are in English, ensuring clarity and peace of mind.",
        image: "/warranty.webp",
    },
    {
        id: 5,
        title: "Contract Review",
        icon: FileText,
        tag: "Final Step",
        subTitle: "Total Transparency",
        content: "Review your contract at home before committing. Available in English, with our support team ready to assist with any questions.",
        image: "/contract.webp",
    }
];
