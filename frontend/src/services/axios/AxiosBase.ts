import appConfig from '@/configs/app.config';
import type { AxiosError } from 'axios';
import axios from 'axios';
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestInterceptorConfigCallback';
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseInterceptorErrorCallback';

// const encryptionService = new EncryptionService(
//     import.meta.env.VITE_PUBLIC_ENCRYPTION_KEY!
// );

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
});

AxiosBase.interceptors.response.use((response) => {
    // if (response.data.encryptedData) {
    //     const decrypted = encryptionService.decrypt(
    //         response.data.encryptedData,
    //         response.data.iv,
    //         response.data.authTag
    //     );
    //     return JSON.parse(decrypted);
    // }
    return response.data;
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
