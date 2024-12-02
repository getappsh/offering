import { ValidationOptions, registerDecorator } from "class-validator";
import { RegexValidation as RegexValidation } from "./regex.validator";

export function IsValidStringFor(property: string, validationOptions?: ValidationOptions) {
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