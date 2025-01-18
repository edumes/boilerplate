import Browserlize from '@/components/crud/Browserlize';
import AddForm from '@/components/crud/AddForm';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { projectService } from '@/services/crud/ProjectService';
import { BrowserlizeProps } from '@/@types/forms';

export default function Projects() {
    const location = useLocation();
    const isAddRoute = location.pathname.endsWith('/add');

    const [formConfig, setFormConfig] = useState<BrowserlizeProps | any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        projectService
            .getFields()
            .then((form) => {
                setFormConfig(form);
            })
            .catch(err => setError(err.message));
    }, []);

    if (!formConfig) return null;

    return isAddRoute ? (
        <AddForm form={{
            config: formConfig.config,
            fields: formConfig.fields,
        }} />
    ) : (
        <Browserlize form={{
            config: formConfig.config,
            fields: formConfig.fields,
        }} />
    );
}
