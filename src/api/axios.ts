import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: '',
    // baseURL: 'http://43.201.59.100:8080',
    headers: {
        // 'Access-Control-Allow-Origin': 'http://43.201.59.100:8080',
    },
});
