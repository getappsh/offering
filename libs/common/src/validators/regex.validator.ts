import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export enum Pattern {
  VERSION = "version",
  MAC = "MAC",
  IP = "IP",
  B_BOX = "bbox",
  Date = "date",
  SINGLE_WORD = "singleWord",
  NOT_ONLY_NUMBERS = "notOnlyNumbers",
  NO_AT_SYMBOL = "noAtSymbol"
}

@ValidatorConstraint({ name: 'regex-validator', async: false })
export class RegexValidation implements ValidatorConstraintInterface {
  validationFor: Pattern;
  regexPattern: RegExp;

  constructor(validationFor: Pattern) {
    this.setRegPattern(validationFor);
  }

  setRegPattern(validationFor: Pattern) {
    this.validationFor = validationFor;

    switch (validationFor) {
      case Pattern.VERSION:
        this.regexPattern = new RegExp(/^(\d+\.)*\d+$/);
        break;
      case Pattern.MAC:
        this.regexPattern = new RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/);
        break;
      case Pattern.IP:
        this.regexPattern = new RegExp(/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
        break;
      case Pattern.B_BOX:
        this.regexPattern = new RegExp(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?(?:,-?\d+(\.\d+)?){0,},-?\d+(\.\d+)?$/);
        break;
      case Pattern.Date:
        this.regexPattern = new RegExp(/^\d{1,2}([/\\\.])\d{1,2}\1\d{2}(\d{2,4})?$/);
        break;
      case Pattern.SINGLE_WORD:
        this.regexPattern = new RegExp(/^[^\s]+$/);
        break;
      case Pattern.NOT_ONLY_NUMBERS:
        this.regexPattern = new RegExp(/^(?!^\d+$).*$/);
        break;
      case Pattern.NO_AT_SYMBOL:
        this.regexPattern = new RegExp(/^[^@]*$/);  // <-- No '@' allowed
        break;
      default:
        break;
    }
  }

  validate(text: string, args: ValidationArguments) {
    if (text === "") {
      return true;
    }
    if (typeof args.value !== "string") {
      return false;
    }

    this.setRegPattern(args.constraints[0]);

    if (this.regexPattern) {
      return this.regexPattern.test(text);
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    if (typeof args.value !== "string") {
      return args.property + " must be a string";
    } else {
      switch (this.validationFor) {
        case Pattern.VERSION:
          return args.property + " must be only digits separated by dots (e.g., 1.1.1)";
        case Pattern.MAC:
        case Pattern.IP:
          return args.property + " is not a valid format";
        case Pattern.B_BOX:
          return args.property + " must be numbers separated by commas (e.g., 34,32,34,31)";
        case Pattern.Date:
          return args.property + ` must be in MM/DD/YY format, separated by /, ${"\\"} or .`;
        case Pattern.SINGLE_WORD:
          return args.property + " must be a single word without spaces";
        case Pattern.NOT_ONLY_NUMBERS:
          return args.property + " must not contain only numbers";
        case Pattern.NO_AT_SYMBOL:
          return args.property + " cannot contain '@'";  // <-- Custom message
        default:
          return 'Not valid!';
      }
    }
  }
}