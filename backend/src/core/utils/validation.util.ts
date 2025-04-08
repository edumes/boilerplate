import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import i18next from 'i18next';
import { ValidationError } from './errors.util';

@ValidatorConstraint({ async: false })
class RegexConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const [regex] = args.constraints;
    return regex.test(value);
  }

  defaultMessage() {
    return i18next.t('VALUE_DOES_NOT_MATCH_PATTERN');
  }
}

function CreateRegexValidator(
  regex: RegExp,
  message: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'RegexValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RegexConstraint,
      constraints: [regex],
    });
  };
}

export function IsValidEmail(validationOptions?: ValidationOptions) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return CreateRegexValidator(emailRegex, 'Invalid email address', validationOptions);
}

export function IsValidPassword(validationOptions?: ValidationOptions) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return CreateRegexValidator(passwordRegex, 'Invalid password', validationOptions);
}

export function ValidatePhone(validationOptions?: ValidationOptions) {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return CreateRegexValidator(phoneRegex, 'Invalid phone number', validationOptions);
}

export function IsValidURL(validationOptions?: ValidationOptions) {
  const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;
  return CreateRegexValidator(urlRegex, 'Invalid URL', validationOptions);
}

export function IsAlpha(validationOptions?: ValidationOptions) {
  const alphaRegex = /^[a-zA-Z]+$/;
  return CreateRegexValidator(alphaRegex, 'Only alphabetic characters allowed', validationOptions);
}

export function IsAlphanumeric(validationOptions?: ValidationOptions) {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return CreateRegexValidator(
    alphanumericRegex,
    'Only alphanumeric characters allowed',
    validationOptions,
  );
}

export function IsValidCreditCardNumber(validationOptions?: ValidationOptions) {
  const cardRegex = /^\d{13,19}$/;
  return CreateRegexValidator(cardRegex, 'Invalid credit card number', validationOptions);
}

export function IsValidHexColor(validationOptions?: ValidationOptions) {
  const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
  return CreateRegexValidator(hexColorRegex, 'Invalid hex color code', validationOptions);
}

@ValidatorConstraint({ async: false })
class RangeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const [min, max] = args.constraints;
    return value >= min && value <= max;
  }

  defaultMessage() {
    return i18next.t('VALUE_IS_OUT_OF_RANGE');
  }
}

function CreateRangeValidator(min: number, max: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'RangeValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RangeConstraint,
      constraints: [min, max],
    });
  };
}

export function ValidateRange(min: number, max: number, validationOptions?: ValidationOptions) {
  return CreateRangeValidator(min, max, validationOptions);
}

@ValidatorConstraint({ async: false })
class RequiredConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const [fieldName] = args.constraints;
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${fieldName} is required`);
    }
    return true;
  }

  defaultMessage() {
    return i18next.t('FIELD_IS_REQUIRED');
  }
}

export function ValidateRequired(fieldName: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RequiredConstraint,
      constraints: [fieldName],
    });
  };
}

@ValidatorConstraint({ async: false })
class IsDateConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return !isNaN(Date.parse(value));
  }

  defaultMessage() {
    return i18next.t('INVALID_DATE');
  }
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsDateConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
class InListConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const [list] = args.constraints;
    return list.includes(value);
  }

  defaultMessage() {
    return i18next.t('VALUE_NOT_IN_ALLOWED_LIST');
  }
}

export function IsInList(list: any[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsInList',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: InListConstraint,
      constraints: [list],
    });
  };
}

@ValidatorConstraint({ async: false })
class IsIntegerConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return Number.isInteger(value);
  }

  defaultMessage() {
    return i18next.t('VALUE_MUST_BE_INTEGER');
  }
}

export function IsValidInteger(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidInteger',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsIntegerConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
class IsFloatConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return !isNaN(value) && value.toString().indexOf('.') !== -1;
  }

  defaultMessage() {
    return i18next.t('VALUE_MUST_BE_VALID_FLOAT');
  }
}

export function IsValidFloat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidFloat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsFloatConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
class IPAddressConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const [ipVersion] = args.constraints;
    if (ipVersion === 'IPv4') {
      const ipv4Regex =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      return ipv4Regex.test(value);
    } else if (ipVersion === 'IPv6') {
      const ipv6Regex = /([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})/;
      return ipv6Regex.test(value);
    }
    return false;
  }

  defaultMessage() {
    return i18next.t('INVALID_IP_ADDRESS');
  }
}

export function IsValidIP(ipVersion: 'IPv4' | 'IPv6', validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidIP',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IPAddressConstraint,
      constraints: [ipVersion],
    });
  };
}
