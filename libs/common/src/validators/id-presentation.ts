import { Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { DiscoveryMessageV2Dto } from '../dto/discovery';
import { PlatformDiscoverDto } from '../dto/discovery/dto/discovery-platform';

@ValidatorConstraint({ name: 'EitherIdPresentConstraint', async: false })
export class EitherIdPresentConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {

    const obj = args.object as DiscoveryMessageV2Dto;

    // Check if root id is present and not empty
    const rootId = obj.id;
    const hasRootId = !!rootId && typeof rootId === 'string' && rootId.trim() !== '';

    // Check if nested general.physicalDevice.ID is present and not empty
    const nestedId = obj.general?.physicalDevice?.ID;
    const hasNestedId = !!nestedId && typeof nestedId === 'string' && nestedId.trim() !== '';

    if (!rootId && hasNestedId) {
      obj.id = nestedId
    }

    // (BACKWARD COMPATIBILITY) If deviceType exist and deviceTypeToken not, move the deviceType to deviceTypeToken
    if (obj.deviceType && !obj.deviceTypeToken){
      obj.deviceTypeToken = obj.deviceType;
      delete obj.deviceType
    }

    // (BACKWARD COMPATIBILITY) If platform name exist and platform token not, move the platform name to token
    if (obj.platform && obj.platform['name'] && !obj.platform.token) {
      obj.platform.token = obj.platform['name'];
    }
   
    // (BACKWARD COMPATIBILITY) If platform is not present and softwareData.platforms is present, set platform
    if (!obj.platform && obj.softwareData?.platforms) {
      const platforms = obj.softwareData?.platforms
      const platform = Array.isArray(platforms) ? platforms[0] : platforms
      if (platform) {
        obj.platform = new PlatformDiscoverDto()
        obj.platform.token = platform
      }
    }

    return hasRootId || hasNestedId;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Either root id or general.physicalDevice.ID must be present and not empty';
  }
}