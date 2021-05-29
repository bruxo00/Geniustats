import axios from 'axios';
import https from 'https';

const ax = axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 20000,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    })
});

ax.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    return Promise.reject({
        code: error.response.status,
        data: error.response.data
    });
});

ax.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default ax;