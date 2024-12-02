import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

export enum Pattern {
  VERSION = "version",
  MAC = "MAC",
  IP = "IP",
  B_BOX = "bbox",
  Date = "date"
}

@ValidatorConstraint({ name: 'regex-validator', async: false })
export class RegexValidation implements ValidatorConstraintInterface {
  validationFor: Pattern
  regexPattern: RegExp


  constructor(validationFor: Pattern) {
    this.setRegPattern(validationFor)
  }

  setRegPattern(validationFor: Pattern) {
    this.validationFor = validationFor

    switch (validationFor) {
      case Pattern.VERSION:
        this.regexPattern = new RegExp(/^(\d+\.)*\d+$/)
        break;
      case Pattern.MAC:
        this.regexPattern = new RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
        break;
      case Pattern.IP:
        this.regexPattern = new RegExp(/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
        break;
      case Pattern.B_BOX:
        this.regexPattern = new RegExp(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?(?:,-?\d+(\.\d+)?){0,},-?\d+(\.\d+)?$/)
        break;
      case Pattern.Date:
        this.regexPattern = new RegExp(/^\d{1,2}([/\\\.])\d{1,2}\1\d{2}(\d{2,4})?$/)
        break;

      default:
        break;
    }
  }

  validate(text: string, args: ValidationArguments) {
    if (text === ""){
      return true
    }
    if (typeof args.value !== "string") {
      return false
    }

    this.setRegPattern(args.constraints[0])

    if (this.regexPattern) {
      return this.regexPattern.test(text)
    }
    return true
  }

  defaultMessage(args: ValidationArguments) {

    if (typeof args.value !== "string") {
      return args.property + " most be a string"
    } else {
      switch (this.validationFor) {
        case Pattern.VERSION:
          return args.property + " is not a valid pattern, it must be only digits separate with one dot - 1.1.1"
        case Pattern.MAC:
        case Pattern.IP:
          return args.property + " is not a valid pattern"
        case Pattern.B_BOX:
          return args.property + " is not a valid pattern for bbox, it must be number separate with one coma - 34,32,34,31"
        case Pattern.Date:
          return args.property + ` is not a valid pattern for DAte, it must be MM/DD/YY separate with one / or ${"\\"} or .`

        default:
          return 'Not valid!';
      }
    }

  }
}