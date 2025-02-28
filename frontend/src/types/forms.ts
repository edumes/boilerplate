export enum FIELD_TYPE {
    TEXT = 'text',
    CHECKBOX = 'checkbox',
    RICHTEXT = 'richtext',
    NUMBER = 'number',
    DATE = 'date',
    EMAIL = 'email',
    URL = 'url',
    FILE = 'file',
    BOOLEAN = 'boolean',
    SELECT = 'select',
    MULTISELECT = 'multiselect',
    COLOR = 'color',
    DATE_TIME = 'datetime',
    TIME = 'time',
    CURRENCY = 'currency',
}

export enum DATE_TYPE {
    DATE_ONLY = 'date',
    DATE_TIME = 'datetime',
}

export enum CURRENCY_TYPE {
    USD = 'USD',
    EUR = 'EUR',
    BRL = 'BRL',
}

export enum NUMBER_TYPE {
    INTEGER = 'integer',
    DECIMAL = 'decimal',
    PERCENT = 'percent',
    CURRENCY = 'currency',
}

export enum SELECT_TYPE {
    SINGLE = 'single',
    MULTIPLE = 'multiple',
}

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
    type: FIELD_TYPE;
    canBrowse: boolean;
    canRead: boolean;
    canEdit: boolean;
    canAdd: boolean;
    label: string;
    displayLabel?: string;
    browseLabel?: string;
    readOnly?: boolean;
    disable?: boolean;
    required?: boolean;
    hidden?: boolean;
    tabs: string[];
    api?: string;
    showOnTop: boolean;
    date?: {
        type: DATE_TYPE;
    };
    currency?: {
        type: CURRENCY_TYPE;
    };
    number?: {
        type: NUMBER_TYPE;
        min?: number;
        max?: number;
    };
    select?: {
        type: SELECT_TYPE;
        options?: string[];
    };
    options?: Array<{ label: string; value: any }>;
}

export interface FormFieldConfig {
    config: FormConfig;
    fields: Record<string, FormField>;
}

export interface BrowserlizeProps {
    form: {
        config: FormConfig;
        fields: Record<string, FormField>;
    };
}

export type UpdateFieldConfig = (
    fieldName: string,
    newProps: Partial<FormField>
) => void;