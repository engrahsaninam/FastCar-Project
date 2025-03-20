// api/carService.js
import axios from 'axios';

const API_BASE_URL = 'http://15.236.131.72:8000';

const carApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCars = async ({
  brand = null,
  model = null,
  minPrice = null,
  maxPrice = null,
  minYear = null,
  maxYear = null,
  minMileage = null,
  maxMileage = null,
  fuel = null,
  gear = null,
  page = 1,
  limit = 20,
  removeOutliers = true,
}) => {
  try {
    const params = {
      brand,
      model,
      min_price: minPrice,
      max_price: maxPrice,
      min_year: minYear,
      max_year: maxYear,
      min_mileage: minMileage,
      max_mileage: maxMileage,
      fuel,
      gear,
      page,
      limit,
      remove_outliers: removeOutliers,
    };

    // Remove null/undefined values from params
    Object.keys(params).forEach(key => 
      params[key] === null || params[key] === undefined ? delete params[key] : {}
    );

    const response = await carApi.get('/api/cars', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

export const getBrands = async () => {
  try {
    const response = await carApi.get('/cars/brands');
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export const getModels = async (brand = null) => {
  try {
    const params = brand ? { brand } : {};
    const response = await carApi.get('/cars/models', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const getCarById = async (carId) => {
  try {
    const response = await carApi.get(`/cars/${carId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching car with ID ${carId}:`, error);
    throw error;
  }
};

export const getSimilarCars = async (carId, limit = 5) => {
  try {
    const response = await carApi.get(`/cars/${carId}/similar`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching similar cars for ID ${carId}:`, error);
    throw error;
  }
};

export default {
  getCars,
  getBrands,
  getModels,
  getCarById,
  getSimilarCars
};