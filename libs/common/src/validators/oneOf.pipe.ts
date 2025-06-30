import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';

@Injectable()
export class oneOfValidationPipe<T> implements PipeTransform {
  constructor(private readonly properties: (keyof T)[]) { }

  transform(value: T, metadata: ArgumentMetadata) {
    let hasOneOfProperties: unknown = undefined

    let isValid: boolean = true;
    this.properties.forEach(property => {

      if (hasOneOfProperties && value[property] !== undefined) {
        isValid = false
        return
      }
      if (!hasOneOfProperties) {
        hasOneOfProperties = value[property]
      }
    });

    if (!isValid) {
      throw new BadRequestException(`You must provide only ONE of the following properties: ${this.properties.join(', ')}`);
    }

    if (!hasOneOfProperties) {
      throw new BadRequestException(`Object can't be empty, you must provide ONE of the following properties: ${this.properties.join(', ')}`);
    }

    return value;
  }
}