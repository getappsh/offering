import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'isStringOrStringArr', async: false })
export class IsStringOrStringArr implements ValidatorConstraintInterface {

  validate(value: string | string[], args: ValidationArguments) {
    if (typeof value === "string") {
      return true
    }
    if (Array.isArray(value)) {
      let isString = true
      value.forEach(v => {
        if (typeof v !== "string") {
          isString = false
        }
      })
      return isString
    }
    return false
  }

  defaultMessage(args: ValidationArguments) {    
    return `${args.property} must be string or array of strings`
  }
}