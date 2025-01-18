import type {
    AuthResult,
    OauthSignInCallbackPayload,
    SignInCredential,
    SignUpCredential,
    Token,
    User,
} from '@/@types/auth';
import appConfig from '@/configs/app.config';
import { REDIRECT_URL_KEY } from '@/constants/app.constant';
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService';
import { useSessionUser, useToken } from '@/store/authStore';
import type { ReactNode } from 'react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

type AuthProviderProps = { children: ReactNode };

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction;
};

const IsolatedNavigator = forwardRef<IsolatedNavigatorRef>((_, ref) => {
    const navigate = useNavigate();

    useImperativeHandle(ref, () => {
        return {
            navigate,
        };
    }, [navigate]);

    return <></>;
});

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn);
    const user = useSessionUser((state) => state.user);
    const setUser = useSessionUser((state) => state.setUser);
    const setSessionSignedIn = useSessionUser(
        (state) => state.setSessionSignedIn
    );
    const { token, setToken } = useToken();

    const authenticated = Boolean(token);

    const navigatorRef = useRef<IsolatedNavigatorRef>(null);

    const redirect = () => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const redirectUrl = params.get(REDIRECT_URL_KEY);

        navigatorRef.current?.navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
        );
    };

    const handleSignIn = (tokens: Token, user?: User) => {
        setToken(tokens.accessToken);
        setSessionSignedIn(true);

        if (user) {
            setUser(user);
        }
    };

    const handleSignOut = () => {
        setToken('');
        setUser({});
        setSessionSignedIn(false);
    };

    const signIn = async (values: SignInCredential): AuthResult => {
        try {
            const response = await apiSignIn(values) as { token: string; user: User };
            if (response?.token) {
                handleSignIn({ accessToken: response.token }, response.user);
                redirect();
                return {
                    status: 'success',
                    message: '',
                };
            }
            return {
                status: 'failed',
                message: 'Unable to sign in',
            };
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            };
        }
    };

    const signUp = async (values: SignUpCredential): AuthResult => {
        try {
            const response = await apiSignUp(values);
            if (response) {
                handleSignIn({ accessToken: response.token }, response.user);
                redirect();
                return {
                    status: 'success',
                    message: '',
                };
            }
            return {
                status: 'failed',
                message: 'Unable to sign up',
            };
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            };
        }
    };

    const signOut = async () => {
        try {
            await apiSignOut();
        } finally {
            handleSignOut();
            navigatorRef.current?.navigate(appConfig.unAuthenticatedEntryPath);
        }
    };

    const oAuthSignIn = (
        callback: (payload: OauthSignInCallbackPayload) => void
    ) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        });
    };

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                signOut,
                oAuthSignIn,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    );
}

IsolatedNavigator.displayName = 'IsolatedNavigator';

export default AuthProvider;
