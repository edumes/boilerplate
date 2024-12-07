import axios from 'axios';
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseInterceptorErrorCallback';
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestInterceptorConfigCallback';
import appConfig from '@/configs/app.config';
import type { AxiosError } from 'axios';

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
});

AxiosBase.interceptors.request.use(
    (config) => {
        return AxiosRequestIntrceptorConfigCallback(config);
    },
    (error) => {
        return Promise.reject(error);
    }
);

AxiosBase.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error);
        return Promise.reject(error);
    }
);

export default AxiosBase;
