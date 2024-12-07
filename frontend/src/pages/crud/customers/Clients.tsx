import Browserlize from '@/components/crud/Browserlize';
import AddForm from '@/components/crud/AddForm';
import ClientFormConfig from './ClientFormConfig';
import { useLocation } from 'react-router-dom';

export default function Clients() {
    const location = useLocation();
    const isAddRoute = location.pathname.endsWith('/add');

    return (
        isAddRoute ? (
            <AddForm form={ClientFormConfig} />
        ) : (
            <Browserlize form={ClientFormConfig} />
        )
    );
}
