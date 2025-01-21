import { Autocomplete, TextField } from '@mui/material';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import type { CommonProps, TypeAttributes } from '../@types/common';
import { useConfig } from '../ConfigProvider';
import { useForm, useFormItem } from '../Form/context';
import { useInputGroup } from '../InputGroup/context';
import { CONTROL_SIZES } from '../utils/constants';

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps extends CommonProps {
    disabled?: boolean;
    invalid?: boolean;
    multiple?: boolean;
    options: SelectOption[];
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
        className,
        disabled,
        invalid,
        multiple = false,
        options,
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

    const { controlSize } = useConfig();
    const formControlSize = useForm()?.size;
    const formItemInvalid = useFormItem()?.invalid;
    const inputGroupSize = useInputGroup()?.size;

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

    return (
        <Autocomplete
            ref={ref}
            multiple={multiple}
            disabled={disabled}
            options={options}
            value={value}
            defaultValue={defaultValue}
            className={!unstyle ? selectClass : ''}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={placeholder}
                    error={isSelectInvalid}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                {prefix && (
                                    <div className="select-prefix">
                                        {prefix}
                                    </div>
                                )}
                                {params.InputProps.startAdornment}
                            </>
                        ),
                        endAdornment: (
                            <>
                                {params.InputProps.endAdornment}
                                {suffix && (
                                    <div className="select-suffix">
                                        {suffix}
                                    </div>
                                )}
                            </>
                        ),
                    }}
                />
            )}
            onChange={(_, newValue: any) => onChange?.(newValue)}
            {...rest}
        />
    );
});

Select.displayName = 'Select';

export default Select;
