import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

enum RegexPatternFor{
  version = "version",
  MAC = "MAC",
  IP = "IP"
}

@ValidatorConstraint({ name: 'regex-validator', async: false })
export class RegexValidation implements ValidatorConstraintInterface {
  validationFor: RegexPatternFor
  regexPattern: RegExp


  constructor(validationFor: RegexPatternFor){
    this.setRegPattern(validationFor)
  }

  setRegPattern(validationFor: RegexPatternFor) {
    this.validationFor = validationFor
    
    switch (validationFor) {
      case RegexPatternFor.version:
        this.regexPattern = new RegExp(/^(\d+\.)*\d+$/)
        break;
      case RegexPatternFor.MAC:
        this.regexPattern = new RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
        break;
      case RegexPatternFor.IP:
        this.regexPattern = new RegExp(/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
        break;
    
      default:
        break;
    }
  }
  
  validate(text: string, args: ValidationArguments) {    
    if(typeof args.value !== "string"){
      return false
    }

    this.setRegPattern(args.constraints[0])

    if(this.regexPattern){
      return this.regexPattern.test(text)
    }
    return true
  }

  defaultMessage(args: ValidationArguments) {

    if(typeof args.value !== "string"){
      return args.property + " most be a string"
    }else{
      switch (this.validationFor) {
        case RegexPatternFor.version:
          return args.property + " is not a valid pattern, it most be only digits separate with one dot - 1.1.1"
        case RegexPatternFor.MAC:
        case RegexPatternFor.IP:
          return args.property + " is not a valid pattern"
      
        default:
          return 'Not valid!';
      }
    }
    
  }
}