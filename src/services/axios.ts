import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://nudjdev.nudj.cx/api/v2',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk0YTI2M2RmM2NlODU5NTVmYTZhZSIsInJvbGVzIjpbIm9yZ0lkLTU2ZjU1MWZiNTc5ZDNjY2U0NjM3Njk2Njpyb2xlLWFkbWluIl0sIm9yZ2FuaXNhdGlvbklkIjoiNTZmNTUxZmI1NzlkM2NjZTQ2Mzc2OTY2IiwiY3JlYXRlZEF0IjoiMjAyNC0xMi0yM1QxMTozMTo1MC42OTRaIiwiaWF0IjoxNzM0OTUzNTEwfQ.w-RoFHhHDZ-GMC5sEUgSnajU7mwss0Ot1MFLJ-Jxdyc`;
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// API methods
export const api = {
    get: <T>(url: string, config = {}) => 
        axiosInstance.get<T>(url, config),

    post: <T>(url: string, data = {}, config = {}) => 
        axiosInstance.post<T>(url, data, config),

    put: <T>(url: string, data = {}, config = {}) => 
        axiosInstance.put<T>(url, data, config),

    patch: <T>(url: string, data = {}, config = {}) => 
        axiosInstance.patch<T>(url, data, config),

    delete: <T>(url: string, config = {}) => 
        axiosInstance.delete<T>(url, config),
};

// Error handling types
export interface ApiError {
    message: string;
    code: string;
    status: number;
}

// Response types
export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

// Example usage types
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export default axiosInstance;