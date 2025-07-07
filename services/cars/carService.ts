import { apiRoutes } from "../apiRoutes";
import axiosInstance from "../axiosInstance"

export interface CarFilters {
    tab?: string;
    priceType?: string;
    min_price?: string;
    max_price?: string;
    min_year?: string;
    max_year?: string;
    min_mileage?: string;
    max_mileage?: string;
    gear?: string;
    vat?: string;
    discounted?: string;
    fuel?: string[];
    electric?: string;
    hybridType?: string;
    powerUnit?: string;
    powerFrom?: string;
    powerTo?: string;
    vehicleTypes?: string[];
    is4x4?: string;
    colour?: string[];
    features?: string[];
    makeModel?: string[];
    body_type?: string[];
    brand?: string[];
    model?: string[];
}

export const getCars = async (page: string, limit: string, filters?: CarFilters) => {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    // Add filters to params if they exist
    if (filters) {
        if (filters.tab) params.append('tab', filters.tab);
        if (filters.priceType) params.append('priceType', filters.priceType);
        if (filters.min_price) params.append('min_price', filters.min_price);
        if (filters.max_price) params.append('max_price', filters.max_price);
        if (filters.min_year) params.append('min_year', filters.min_year);
        if (filters.max_year) params.append('max_year', filters.max_year);
        if (filters.min_mileage) params.append('min_mileage', filters.min_mileage);
        if (filters.max_mileage) params.append('max_mileage', filters.max_mileage);
        if (filters.gear) params.append('gear', filters.gear);
        if (filters.vat) params.append('vat', filters.vat);
        if (filters.discounted) params.append('discounted', filters.discounted);
        if (filters.electric) params.append('electric', filters.electric);
        if (filters.hybridType) params.append('hybridType', filters.hybridType);
        if (filters.powerUnit) params.append('powerUnit', filters.powerUnit);
        if (filters.powerFrom) params.append('powerFrom', filters.powerFrom);
        if (filters.powerTo) params.append('powerTo', filters.powerTo);
        if (filters.is4x4) params.append('is4x4', filters.is4x4);

        // Handle array parameters
        if (filters.fuel?.length) params.append('fuel', filters.fuel.join(','));
        if (filters.body_type?.length) params.append('body_type', filters.body_type.join(','));
        if (filters.colour?.length) params.append('colour', filters.colour.join(','));
        if (filters.features?.length) params.append('features', filters.features.join(','));
        if (filters.makeModel?.length) params.append('makeModel', filters.makeModel.join(','));

        // Handle brand and model parameters
        if (filters.brand?.length) {
            filters.brand.forEach(brand => params.append('brand', brand));
        }
        if (filters.model?.length) {
            filters.model.forEach(model => params.append('model', model));
        }

        params.append('remove_outliers', 'false');
    }

    const response = await axiosInstance.get(`${apiRoutes.car.base}?${params.toString()}`);
    return response.data;
}

export const getPriceRange = async () => {
    const response = await axiosInstance.get(apiRoutes.filters.price);
    console.log("price response", response.data)
    return response.data;
}

export const getMileageRange = async () => {
    const response = await axiosInstance.get(apiRoutes.filters.mileage);
    console.log("mileage response", response)
    return response.data;
}
export const getYears = async () => {
    const response = await axiosInstance.get(apiRoutes.filters.years);
    return response.data;
}
export const getFuelType = async () => {
    const response = await axiosInstance.get(apiRoutes.filters.fuelTypes);
    return response.data;
}
export const getTransmissionType = async () => {
    const response = await axiosInstance.get(apiRoutes.filters.transmissiontypes);
    return response.data;
}


export const getBestDeals = async (filters?: {
    brand?: string;
    model?: string;
    year?: string;
    limit?: string;
    page?: string;
}) => {
    const params = new URLSearchParams();
    if (filters) {
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.model) params.append('model', filters.model);
        if (filters.year) params.append('year', filters.year);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.page) params.append('page', filters.page);
        params.append('remove_outliers', 'false');

    }
    const response = await axiosInstance.get(`${apiRoutes.car.deals}?${params.toString()}`);
    return response.data;
}

export const getBrands = async () => {
    const response = await axiosInstance.get(apiRoutes.filters.brands);
    return response.data;
}
export const getModels = async (brand: string) => {
    const response = await axiosInstance.get(`${apiRoutes.filters.models}/?brand=${brand}`);
    return response.data;
}
export const getBodyTypes = async () => {
    const response = await axiosInstance.get(apiRoutes.filters.bodyTypes);
    return response.data;
}
export const getColors = async () => {
    const response = await axiosInstance.get(apiRoutes.filters.colors);
    return response.data;
}
export const getFeatures = async () => {
    const response = await axiosInstance.get(apiRoutes.filters.features);
    return response.data;
}


export const saveCar = async (id: string) => {
    const response = await axiosInstance.post(apiRoutes.car.save(id));
    return response.data;
}
export const unsaveCar = async (id: string) => {
    const response = await axiosInstance.delete(apiRoutes.car.unsave(id));
    return response.data;
}
export const getSavedCars = async () => {
    const response = await axiosInstance.get(apiRoutes.car.getSavedCars);
    return response.data;
}

export const getCar = async (id: string) => {
    const response = await axiosInstance.get(`${apiRoutes.car.getCar(id)}`);
    return response.data;
}
export const getSimilarCars = async (id: string) => {
    const response = await axiosInstance.get(`${apiRoutes.car.similar(id)}`, {
        params: {
            // limit,
            remove_outliers: false
        }
    });
    return response.data;
}
export const getCharges = async (id: string, zipcode?: string) => {
    const url = apiRoutes.car.getCharges(id, zipcode);
    const response = await axiosInstance.get(url);
    return response.data;
}

export const applyfinance = async (data: any) => {
    const response = await axiosInstance.post(apiRoutes.car.financing.apply, data)
    return response.data;
}
export const submitInspection = async (data: any) => {
    const response = await axiosInstance.post(apiRoutes.car.inspection.submit, data)
    return response.data;
}
export const createInspectionSession = async (id: string) => {
    const response = await axiosInstance.post(apiRoutes.car.inspection.create(id));
    console.log("response from stripe", response.data)
    return response.data;
}
export const getInspectionSuccess = async (id: string) => {
    const response = await axiosInstance.get(apiRoutes.car.inspection.success(id));
    return response.data;
}
export const getLatestUserStatus = async (id: string) => {
    const response = await axiosInstance.get(apiRoutes.car.delivery.status(id))
    return response.data
}
export const getCheckoutStatus = async (purchaseid: string, financeId: string) => {
    const response = await axiosInstance.post(apiRoutes.car.delivery.checkout, {
        purchase_id: purchaseid,
        finance_id: financeId
    })
    return response.data;
}
export const submitDeliveryInfor = async (data: any) => {
    const response = await axiosInstance.post(apiRoutes.car.delivery.submit, data)
    return response.data
}