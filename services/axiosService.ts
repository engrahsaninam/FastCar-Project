import axios_ from "axios";
const TOKEN_TYPE = "Bearer";
const url = process.env.NEXT_PUBLIC_BACKEND_URL; // Use NEXT_PUBLIC_ prefix for frontend access
console.log("url", url);
console.log(url);
if (!url) {
    console.error("BACKEND_URL is not defined. Check your .env.local file.");
} else {
}

const axios = axios_.create({
    baseURL: url,
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins (change if needed)
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
});

axios.interceptors.request.use(
    async (config) => {
        let token = localStorage.get("access_token");
        if (token) {
            try {
                token = JSON.parse(token);
            } catch (e) { }
            config.headers.Authorization = `${TOKEN_TYPE} ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;
