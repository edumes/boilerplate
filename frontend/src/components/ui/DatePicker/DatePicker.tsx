import { DatePicker as AntdDatePicker } from 'antd';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import type { CommonProps, TypeAttributes } from '../@types/common';
import { useConfig } from '../ConfigProvider';
import { useForm, useFormItem } from '../Form/context';
import { useInputGroup } from '../InputGroup/context';
import { CONTROL_SIZES } from '../utils/constants';
import type { Dayjs } from 'dayjs';

export interface DatePickerProps extends CommonProps {
    name: string;
    disabled?: boolean;
    invalid?: boolean;
    size?: TypeAttributes.ControlSize;
    value?: Dayjs | null;
    defaultValue?: Dayjs | null;
    onChange?: (value: Dayjs | null) => void;
    placeholder?: string;
    prefix?: string | ReactNode;
    suffix?: string | ReactNode;
    unstyle?: boolean;
    format?: string;
    showTime?: boolean;
}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
    const {
        name,
        className,
        disabled,
        invalid,
        size,
        value,
        defaultValue,
        onChange,
        placeholder = 'Selecione uma data...',
        prefix,
        suffix,
        unstyle = false,
        format = 'DD/MM/YYYY',
        showTime = false,
        ...rest
    } = props;

    const { controlSize } = useConfig();
    const formControlSize = useForm()?.size;
    const formItemInvalid = useFormItem()?.invalid;
    const inputGroupSize = useInputGroup()?.size;

    const datePickerSize = size || inputGroupSize || formControlSize || controlSize;
    const isDatePickerInvalid = invalid || formItemInvalid;

    const datePickerDefaultClass = 'datepicker';
    const datePickerSizeClass = `datepicker-${datePickerSize} ${CONTROL_SIZES[datePickerSize].h}`;
    const datePickerFocusClass = `focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary`;

    const datePickerClass = classNames(
        datePickerDefaultClass,
        datePickerSizeClass,
        !isDatePickerInvalid && datePickerFocusClass,
        className,
        disabled && 'datepicker-disabled',
        isDatePickerInvalid && 'datepicker-invalid'
    );

    return (
        <AntdDatePicker
            size='middle'
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            className={!unstyle ? datePickerClass : ''}
            onChange={onChange}
            format={format}
            showTime={showTime}
            {...rest}
        />
    );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;