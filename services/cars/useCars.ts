import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getBestDeals,
    getBrands,
    getCars,
    getFuelType,
    getMileageRange,
    getPriceRange,
    getTransmissionType,
    getYears,
    getModels,
    getBodyTypes,
    getColors,
    getFeatures,
} from "./carService";
import axiosInstance from "../axiosInstance";
import { apiRoutes } from "../apiRoutes";

// Cars
export const useCar = (page: string, limit: string, filters?: Record<string, any>) => {
    return useQuery({
        queryKey: ["cars", page, limit, JSON.stringify(filters)],
        queryFn: () => getCars(page, limit, filters),
        enabled: Boolean(page && limit), // only fetch if page and limit exist
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
};

// Price Range
export const usePriceRange = () =>
    useQuery({
        queryKey: ["priceRange"],
        queryFn: getPriceRange,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

// Mileage Range
export const useMileageRange = () =>
    useQuery({
        queryKey: ["mileageRange"],
        queryFn: getMileageRange,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

// Year Range
export const useyearsRange = () =>
    useQuery({
        queryKey: ["yearsRange"],
        queryFn: getYears,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

// Fuel Type
export const useFuelType = () =>
    useQuery({
        queryKey: ["fuelType"],
        queryFn: getFuelType,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

// Transmission Type
export const useTransmissionType = () =>
    useQuery({
        queryKey: ["transmissionType"],
        queryFn: getTransmissionType,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

// Best Deals
export const useBestDeals = (filters?: {
    brand?: string;
    model?: string;
    year?: string;
    limit?: string;
    page?: string;
}) => {
    return useQuery({
        queryKey: ["bestDeals", JSON.stringify(filters)],
        queryFn: () => getBestDeals(filters),
        enabled: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
};

// Brands
export const useBrands = () =>
    useQuery({
        queryKey: ["brands"],
        queryFn: getBrands,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

// Models (only if brand exists)
export const useModels = (brand: string) =>
    useQuery({
        queryKey: ["models", brand],
        queryFn: () => getModels(brand),
        enabled: !!brand,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

// Registration Mutation
export const useRegistration = () =>
    useMutation({
        mutationFn: async (data: {
            username: string;
            email: string;
            password: string;
            confirm_password: string;
        }) => {
            const response = await axiosInstance.post(apiRoutes.auth.register, data);
            return response.data;
        },
    });

// Body Types
export const useBodyTypes = () =>
    useQuery({
        queryKey: ["bodyTypes"],
        queryFn: getBodyTypes,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

// Colors
export const useColors = () =>
    useQuery({
        queryKey: ["colors"],
        queryFn: getColors,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

// Features
export const useFeatures = () =>
    useQuery({
        queryKey: ["features"],
        queryFn: getFeatures,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
