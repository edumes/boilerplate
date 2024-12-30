import Browserlize from '@/components/crud/Browserlize';
import AddForm from '@/components/crud/AddForm';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { projectService } from '@/services/crud/ProjectService';

export default function Projects() {
    const location = useLocation();

    const [fields, setFields] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        projectService
            .getFields()
            .then(setFields)
            .catch(err => setError(err.message));
    }, []);

    if (error) return <p>Erro: {error}</p>;

    // if (fields) return (
    //     <Browserlize form={fields} />
    // );
}
