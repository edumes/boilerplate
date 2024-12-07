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
    fields: [
        {
            name: 'name',
            order: 1,
            width: 3,
            browserOrder: 1,
            browserWidth: 1,
            type: FIELD_TYPE_TEXT,
            canBrowse: true,
            canRead: true,
            canEdit: true,
            canAdd: true,
            label: 'Código do Projeto',
            required: true,
            tabs: ['main'],
            showOnTop: false,
        },
        {
            name: 'email',
            order: 65,
            width: 12,
            browserWidth: 6,
            type: FIELD_TYPE_RICHTEXT,
            canBrowse: false,
            canRead: true,
            canEdit: true,
            canAdd: true,
            label: 'Observações',
            tabs: ['main'],
            showOnTop: false,
        },
    ],
};

export default ClientFormConfig;
