import ApiService from './ApiService';
import type {
    SignInCredential,
    SignUpCredential,
    // ForgotPassword,
    // ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth';

export async function apiSignIn(data: SignInCredential): Promise<SignInResponse> {
    return ApiService.fetchData({
        url: '/auth/login',
        method: 'post',
        data,
    });
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/sign-up',
        method: 'post',
        data,
    });
}

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/auth/logout',
        method: 'post',
    });
}

export async function apiGetCurrentUser() {
    return ApiService.fetchData({
        url: '/auth/me',
        method: 'get',
    });
}
