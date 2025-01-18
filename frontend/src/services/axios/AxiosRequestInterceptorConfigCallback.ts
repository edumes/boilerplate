import appConfig from '@/configs/app.config';
import {
    REQUEST_HEADER_AUTH_KEY,
    TOKEN_NAME_IN_STORAGE,
    TOKEN_TYPE,
} from '@/constants/api.constant';
import type { InternalAxiosRequestConfig } from 'axios';

const AxiosRequestIntrceptorConfigCallback = (
    config: InternalAxiosRequestConfig
) => {
    const storage = appConfig.accessTokenPersistStrategy;

    if (storage === 'localStorage') {
        let accessToken = '';

        if (storage === 'localStorage') {
            accessToken = localStorage.getItem(TOKEN_NAME_IN_STORAGE) || '';
        }
        console.log({accessToken})

        if (accessToken) {
            config.headers[REQUEST_HEADER_AUTH_KEY] =
                `${TOKEN_TYPE}${accessToken}`;
        }
    }

    return config;
};

export default AxiosRequestIntrceptorConfigCallback;
