import {
    FIELD_TYPE_CHECKTREE,
    FIELD_TYPE_RICHTEXT,
    FIELD_TYPE_SELECT,
    FIELD_TYPE_TEXT,
} from '@/constants/fields.constant';

import type { FormFieldConfig } from '@/@types/forms';

const ClientFormConfig: FormFieldConfig = {
    config: {
        prefix: 'client',
        table: 'clients',
        singularName: 'Cliente',
        pluralName: 'Clientes',
        icon: 'toolbox',
        permissions: {
            delete: true,
            add: true,
            edit: true,
            read: false,
            browse: false,
        },
        tabs: [
            { key: 'main', label: 'Principal' },
            { key: 'historic-situation', label: 'Histórico de Situações' },
            { key: 'appointment', label: 'Apontamentos' },
        ],
        version: '05-09-2024|10-55-45',
    },
    fields: {
        user_name: {
            name: 'user_name',
            order: 1,
            width: 4,
            browserOrder: 1,
            browserWidth: 1,
            type: FIELD_TYPE_TEXT,
            canBrowse: true,
            canRead: true,
            canEdit: true,
            canAdd: true,
            label: 'Nome',
            required: true,
            tabs: ['main'],
            showOnTop: false,
        },
        user_email: {
            name: 'user_email',
            order: 65,
            width: 5,
            browserWidth: 6,
            type: FIELD_TYPE_RICHTEXT,
            canBrowse: false,
            canRead: true,
            canEdit: true,
            canAdd: true,
            label: 'Email',
            tabs: ['main'],
            showOnTop: false,
        },
    },
};

export default ClientFormConfig;
