export type AppConfig = {
    apiPrefix: string;
    authenticatedEntryPath: string;
    unAuthenticatedEntryPath: string;
    locale: string;
    accessTokenPersistStrategy: 'localStorage' | 'cookies';
    enableMock: boolean;
};

const appConfig: AppConfig = {
    apiPrefix: '/api/v1',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    accessTokenPersistStrategy: 'localStorage',
    enableMock: true,
};

export default appConfig;
