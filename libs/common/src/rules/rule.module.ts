import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleEntity } from '../database/entities/rule.entity';
import { RuleReleaseEntity } from '../database/entities/rule-release.entity';
import { RuleDeviceTypeEntity } from '../database/entities/rule-device-type.entity';
import { RuleDeviceEntity } from '../database/entities/rule-device.entity';
import { RuleOsEntity } from '../database/entities/rule-os.entity';
import { RuleFieldEntity } from '../database/entities/rule-field.entity';
import { ReleaseEntity } from '../database/entities/release.entity';
import { DeviceTypeEntity } from '../database/entities/device-type.entity';
import { DeviceEntity } from '../database/entities/device.entity';
import { RuleService } from './services/rule.service';
import { RuleValidationService } from './services/rule-validation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RuleEntity,
      RuleReleaseEntity,
      RuleDeviceTypeEntity,
      RuleDeviceEntity,
      RuleOsEntity,
      RuleFieldEntity,
      ReleaseEntity,
      DeviceTypeEntity,
      DeviceEntity,
    ]),
  ],
  providers: [RuleService, RuleValidationService],
  exports: [RuleService, RuleValidationService],
})
export class RuleModule {}
