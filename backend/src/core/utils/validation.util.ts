import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import i18next from 'i18next';
import { ValidationError } from './errors.util';

/**
 * Validator constraint for regex pattern matching
 */
@ValidatorConstraint({ async: false })
class RegexConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the value matches the provided regex pattern
   * @param value - Value to validate
   * @param args - Validation arguments containing regex pattern
   * @returns True if value matches pattern
   */
  validate(value: any, args: any) {
    const [regex] = args.constraints;
    return regex.test(value);
  }

  /**
   * Returns the default error message
   * @returns Error message from i18n
   */
  defaultMessage() {
    return i18next.t('VALUE_DOES_NOT_MATCH_PATTERN');
  }
}

/**
 * Creates a regex validator decorator
 * @param regex - Regular expression pattern
 * @param message - Error message
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
function CreateRegexValidator(
  regex: RegExp,
  message: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'RegexValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RegexConstraint,
      constraints: [regex]
    });
  };
}

/**
 * Validates if a string is a valid email address
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsValidEmail(validationOptions?: ValidationOptions) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return CreateRegexValidator(emailRegex, 'Invalid email address', validationOptions);
}

/**
 * Validates if a string meets password requirements
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsValidPassword(validationOptions?: ValidationOptions) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return CreateRegexValidator(passwordRegex, 'Invalid password', validationOptions);
}

/**
 * Validates if a string is a valid phone number
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function ValidatePhone(validationOptions?: ValidationOptions) {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return CreateRegexValidator(phoneRegex, 'Invalid phone number', validationOptions);
}

/**
 * Validates if a string is a valid URL
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsValidURL(validationOptions?: ValidationOptions) {
  const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;
  return CreateRegexValidator(urlRegex, 'Invalid URL', validationOptions);
}

/**
 * Validates if a string contains only alphabetic characters
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsAlpha(validationOptions?: ValidationOptions) {
  const alphaRegex = /^[a-zA-Z]+$/;
  return CreateRegexValidator(alphaRegex, 'Only alphabetic characters allowed', validationOptions);
}

/**
 * Validates if a string contains only alphanumeric characters
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsAlphanumeric(validationOptions?: ValidationOptions) {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return CreateRegexValidator(
    alphanumericRegex,
    'Only alphanumeric characters allowed',
    validationOptions
  );
}

/**
 * Validates if a string is a valid credit card number
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsValidCreditCardNumber(validationOptions?: ValidationOptions) {
  const cardRegex = /^\d{13,19}$/;
  return CreateRegexValidator(cardRegex, 'Invalid credit card number', validationOptions);
}

/**
 * Validates if a string is a valid hex color code
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsValidHexColor(validationOptions?: ValidationOptions) {
  const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
  return CreateRegexValidator(hexColorRegex, 'Invalid hex color code', validationOptions);
}

/**
 * Validator constraint for range validation
 */
@ValidatorConstraint({ async: false })
class RangeConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the value is within the specified range
   * @param value - Value to validate
   * @param args - Validation arguments containing min and max values
   * @returns True if value is within range
   */
  validate(value: any, args: any) {
    const [min, max] = args.constraints;
    return value >= min && value <= max;
  }

  /**
   * Returns the default error message
   * @returns Error message from i18n
   */
  defaultMessage() {
    return i18next.t('VALUE_IS_OUT_OF_RANGE');
  }
}

/**
 * Creates a range validator decorator
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
function CreateRangeValidator(min: number, max: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'RangeValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RangeConstraint,
      constraints: [min, max]
    });
  };
}

/**
 * Validates if a value is within a specified range
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function ValidateRange(min: number, max: number, validationOptions?: ValidationOptions) {
  return CreateRangeValidator(min, max, validationOptions);
}

/**
 * Validator constraint for required field validation
 */
@ValidatorConstraint({ async: false })
class RequiredConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the value is not undefined, null, or empty
   * @param value - Value to validate
   * @param args - Validation arguments containing field name
   * @returns True if value is valid
   * @throws ValidationError if value is invalid
   */
  validate(value: any, args: any) {
    const [fieldName] = args.constraints;
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${fieldName} is required`);
    }
    return true;
  }

  /**
   * Returns the default error message
   * @returns Error message from i18n
   */
  defaultMessage() {
    return i18next.t('FIELD_IS_REQUIRED');
  }
}

/**
 * Validates if a field is required
 * @param fieldName - Name of the field
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function ValidateRequired(fieldName: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RequiredConstraint,
      constraints: [fieldName]
    });
  };
}

/**
 * Validator constraint for date validation
 */
@ValidatorConstraint({ async: false })
class IsDateConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the value is a valid date
   * @param value - Value to validate
   * @returns True if value is a valid date
   */
  validate(value: any) {
    return !isNaN(Date.parse(value));
  }

  /**
   * Returns the default error message
   * @returns Error message from i18n
   */
  defaultMessage() {
    return i18next.t('INVALID_DATE');
  }
}

/**
 * Validates if a value is a valid date
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsDateConstraint
    });
  };
}

/**
 * Validator constraint for list membership validation
 */
@ValidatorConstraint({ async: false })
class InListConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the value is in the allowed list
   * @param value - Value to validate
   * @param args - Validation arguments containing allowed list
   * @returns True if value is in list
   */
  validate(value: any, args: any) {
    const [list] = args.constraints;
    return list.includes(value);
  }

  /**
   * Returns the default error message
   * @returns Error message from i18n
   */
  defaultMessage() {
    return i18next.t('VALUE_NOT_IN_ALLOWED_LIST');
  }
}

/**
 * Validates if a value is in a specified list
 * @param list - List of allowed values
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsInList(list: any[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsInList',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: InListConstraint,
      constraints: [list]
    });
  };
}

/**
 * Validator constraint for integer validation
 */
@ValidatorConstraint({ async: false })
class IsIntegerConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the value is an integer
   * @param value - Value to validate
   * @returns True if value is an integer
   */
  validate(value: any) {
    return Number.isInteger(value);
  }

  /**
   * Returns the default error message
   * @returns Error message from i18n
   */
  defaultMessage() {
    return i18next.t('VALUE_MUST_BE_INTEGER');
  }
}

/**
 * Validates if a value is a valid integer
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsValidInteger(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidInteger',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsIntegerConstraint
    });
  };
}

/**
 * Validator constraint for float validation
 */
@ValidatorConstraint({ async: false })
class IsFloatConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the value is a valid float
   * @param value - Value to validate
   * @returns True if value is a valid float
   */
  validate(value: any) {
    return !isNaN(value) && value.toString().indexOf('.') !== -1;
  }

  /**
   * Returns the default error message
   * @returns Error message from i18n
   */
  defaultMessage() {
    return i18next.t('VALUE_MUST_BE_VALID_FLOAT');
  }
}

/**
 * Validates if a value is a valid float
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsValidFloat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidFloat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsFloatConstraint
    });
  };
}

/**
 * Validator constraint for IP address validation
 */
@ValidatorConstraint({ async: false })
class IPAddressConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the value is a valid IP address
   * @param value - Value to validate
   * @param args - Validation arguments containing IP version
   * @returns True if value is a valid IP address
   */
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

  /**
   * Returns the default error message
   * @returns Error message from i18n
   */
  defaultMessage() {
    return i18next.t('INVALID_IP_ADDRESS');
  }
}

/**
 * Validates if a value is a valid IP address
 * @param ipVersion - IP version to validate ('IPv4' or 'IPv6')
 * @param validationOptions - Additional validation options
 * @returns Decorator function
 */
export function IsValidIP(ipVersion: 'IPv4' | 'IPv6', validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidIP',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IPAddressConstraint,
      constraints: [ipVersion]
    });
  };
}
