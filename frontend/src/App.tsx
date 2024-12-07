import { AuthProvider } from '@/auth';
import Layout from '@/components/layouts';
import Theme from '@/components/template/Theme';
import Views from '@/pages';
import { BrowserRouter } from 'react-router-dom';
import appConfig from './configs/app.config';
import './locales';

if (appConfig.enableMock) {
    import('./mock');
}

function App() {
    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <Layout>
                        <Views />
                    </Layout>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    );
}

export default App;
