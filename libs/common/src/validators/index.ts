import { ValidationOptions, registerDecorator } from "class-validator";
import { Pattern, RegexValidation as RegexValidation } from "./regex.validator";

export function IsValidStringFor(property: Pattern, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: RegexValidation
    });
  };
}