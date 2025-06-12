import { register } from "module";

export const apiRoutes = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        resetPassword: "/auth/reset-password",
        forgotPassword: "/auth/forgot-password",
        signUpgoogle: "/auth/google-signup",
        currentuser: '/users/me'
    },

    car: {
        base: "/cars",
        get: (page: string, limit: string) => `/cars?page=${page}&limit=${limit}`,
        deals: "/cars/best-deals",
        save: (id: string) => `/users/saved-cars/${id}`,
        unsave: (id: string) => `/users/saved-cars/${id}`,
        getSavedCars: "/users/saved-cars",
        getCar: (id: string) => `/cars/${id}`,
        similar: (id: string) => `/cars/${id}/similar`,
    },
    filters: {
        fuel: '/filters/fuel-types',
        price: '/filters/prices',
        mileage: "/filters/mileage",
        years: "/filters/years",
        fuelTypes: "/filters/fuel-types",
        transmissiontypes: "/filters/transmission-types",
        brands: "/cars/brands/",
        models: "/cars/models",
        bodyTypes: "/filters/body-types",
        colors: "/filters/colours",
        features: "/filters/features",
    },
}