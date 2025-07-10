import { register } from "module";

export const apiRoutes = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        resetPassword: "/auth/reset-password",
        forgotPassword: "/auth/forgot-password",
        signUpgoogle: "/auth/google-signup",
        currentuser: '/users/me',
        verifyEmail: '/auth/verify-email',

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
        getCharges: (id: string, zipcode?: string) => zipcode ? `/charges?car_id=${id}&zipcode=${zipcode}` : `/charges?car_id=${id}`,
        financing: {
            apply: "/purchase/finance/apply",
            details: (car_id: string) =>`/api/purchase/purchase-details-user?car_id=${car_id}`
        },
        inspection: {
            submit: "/purchase/bank-transfer/submit",
            create: (id: string) => `/purchase/checkout/${id}`,
            success: (id: string) => `/purchase/success-car-inspection?session_id=${id}`,
        },
        delivery: {
            status: (id: string)=> `/purchase/get-latest-user-context?car_id=${id}`,
            submit: "/purchase/submit-delivery-info",
            checkout:"/purchase/checkout-delivery",
        },
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