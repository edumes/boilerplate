import { BaseService } from '@/services/crud/BaseService';
import { Select as AntdSelect } from 'antd';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import { forwardRef, useEffect, useState } from 'react';
import type { CommonProps, TypeAttributes } from '../@types/common';
import { useConfig } from '../ConfigProvider';
import { useForm, useFormItem } from '../Form/context';
import { useInputGroup } from '../InputGroup/context';
import { CONTROL_SIZES } from '../utils/constants';
import transformForeignKeyString from '../utils/transformForeignKeyString';

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps extends CommonProps {
    name: string;
    disabled?: boolean;
    invalid?: boolean;
    options?: SelectOption[];
    size?: TypeAttributes.ControlSize;
    value?: SelectOption | SelectOption[] | null;
    defaultValue?: SelectOption | SelectOption[] | null;
    onChange?: (value: SelectOption | SelectOption[] | null) => void;
    placeholder?: string;
    prefix?: string | ReactNode;
    suffix?: string | ReactNode;
    unstyle?: boolean;
}

const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
    const {
        name,
        className,
        disabled,
        invalid,
        // options,
        size,
        value,
        defaultValue,
        onChange,
        placeholder,
        prefix,
        suffix,
        unstyle = false,
        ...rest
    } = props;

    const baseService = new BaseService<any>(`${transformForeignKeyString(name)}`);

    const { controlSize } = useConfig();
    const formControlSize = useForm()?.size;
    const formItemInvalid = useFormItem()?.invalid;
    const inputGroupSize = useInputGroup()?.size;

    const [options, setOptions] = useState(null);
    const [error, setError] = useState<string | null>(null);

    const selectSize = size || inputGroupSize || formControlSize || controlSize;
    const isSelectInvalid = invalid || formItemInvalid;

    const selectDefaultClass = 'select';
    const selectSizeClass = `select-${selectSize} ${CONTROL_SIZES[selectSize].h}`;
    const selectFocusClass = `focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary`;

    const selectClass = classNames(
        selectDefaultClass,
        selectSizeClass,
        !isSelectInvalid && selectFocusClass,
        className,
        disabled && 'select-disabled',
        isSelectInvalid && 'select-invalid'
    );

    useEffect(() => {
        baseService
            .selectOptions()
            .then((options) => {
                setOptions(options);
            })
            .catch(err => setError(err.message));
    }, []);

    return (
        <AntdSelect
            // ref={ref}
            size='small'
            allowClear
            showSearch
            optionFilterProp="label"
            disabled={disabled}
            options={options}
            value={value}
            defaultValue={defaultValue}
            className={!unstyle ? selectClass : ''}
            onChange={(value) => onChange(value)}
            {...rest}
        />
    );
});

Select.displayName = 'Select';

export default Select;
