import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create an instance of axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://noco.skrt.me/api/v2',  // Replace with your API base URL
  timeout: 10000  // Adjust the timeout as needed
});

// Add a request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = process.env.NEXT_PUBLIC_NOCODB_API_KEY // Assuming you store your token in env variables
    if (token) {
      config.headers = config.headers || {};
      config.headers.set('xc-token', token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
