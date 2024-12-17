import { Logger, applyDecorators } from '@nestjs/common';

export function Deprecated() {

  const logger = new Logger('DeprecatedField');
  return applyDecorators(
    (target: any, propertyKey: string) => {
      const message = `Warning: The field "${propertyKey}" in ${target.constructor.name} is deprecated and will be removed in the future.`;
      logger.warn(message);
    },
  );
}
