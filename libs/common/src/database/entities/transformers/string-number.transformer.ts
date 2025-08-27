import { Logger } from "@nestjs/common";
import { ValueTransformer } from "typeorm";

export class StringNumberTransformer implements ValueTransformer {
  private readonly logger = new Logger(StringNumberTransformer.name);

  to(value: any) {
    return value;
  }

  from(value: string) {
    // this.logger.debug(`transform string ${value} to number`);
    let numValue = Number(value)
    if (!Number.isSafeInteger(numValue)) {
      Number.MAX_SAFE_INTEGER
      this.logger.warn(`The number ${value} is more then Number.MAX_SAFE_INTEGER`)
    }
    return numValue
  }

}