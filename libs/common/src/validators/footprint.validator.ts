import { Logger } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
const gjv = require("geojson-validation");

@ValidatorConstraint({ name: 'footprint-validator', async: false })
export class FootprintValidator implements ValidatorConstraintInterface {
  private readonly logger = new Logger(FootprintValidator.name);
 
  validate(footprint: string, args: ValidationArguments) {
    if(typeof args.value !== "string"){
      return false
    }
    const geoJSONObject = typeof footprint === 'string' ? JSON.parse(footprint) : footprint;

 
    return gjv.valid(geoJSONObject);

  }

  defaultMessage(args: ValidationArguments) {
    const errors = gjv.isGeoJSONObject(JSON.parse(args.value), true)
    this.logger.error(`Invalid GeoJSON format. Errors: ${errors.map((error: any) => error).join(', ')}`)

    return `Invalid GeoJSON format`
  }
}