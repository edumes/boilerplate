import Browserlize from '@/components/crud/Browserlize';
import ClientFormConfig from './ClientFormConfig';
import Card from '@mui/material/Card';

export default function Clients() {
    return (
        <Card>
            <Browserlize form={ClientFormConfig} />
        </Card>
    );
}
