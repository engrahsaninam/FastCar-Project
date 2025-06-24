import axios from 'axios';
// import useStore from '../store';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://15.237.243.191:8000/api';
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // const stateToken = useStore.getState().token;
        const localStorageToken = localStorage.getItem('token');
        const token = localStorageToken;

        console.log("token", token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosInstance