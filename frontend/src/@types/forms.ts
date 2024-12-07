export interface TabConfig {
    key: string;
    label: string;
}

export interface FormConfig {
    prefix: string;
    table: string;
    singularName: string;
    pluralName: string;
    icon: string;
    permissions: {
        delete: boolean;
        add: boolean;
        edit: boolean;
        read: boolean;
        browse: boolean;
    };
    tabs: TabConfig[];
    version: string;
}

export interface FormField {
    name: string;
    order: number;
    width: number;
    browserOrder?: number;
    browserWidth?: number;
    type: string;
    canBrowse: boolean;
    canRead: boolean;
    canEdit: boolean;
    canAdd: boolean;
    label: string;
    displayLabel?: string;
    browseLabel?: string;
    readOnly?: boolean;
    required?: boolean;
    hidden?: boolean;
    tabs: string[];
    api?: string;
    showOnTop: boolean;
}

export interface FormFieldConfig {
    config: FormConfig;
    fields: FormField[];
}
