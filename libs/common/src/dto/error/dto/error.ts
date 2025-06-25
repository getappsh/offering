import { Logger } from "@nestjs/common";
import { ApiProperty, } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";


export enum ErrorCode {
  // app
  APP_OTHER = "APP.unknown",

  // delivery
  DLV_OTHER = "DELIVERY.unknown",
  DLV_NOT_FOUND = 'DELIVERY.notFound',
  DLV_DOWNLOAD = "DELIVERY.download",
  DLV_DOWNLOAD_NOT_AVAILABLE = "DELIVERY.downloadNotAvailable",
  DLV_C_NOT_EXIST = 'DELIVERY.notExist',
  DLV_C_INVALID = "DELIVERY.invalid",
  DLV_C_NOT_VERIFIED = "DELIVERY.notVerified",
  DLV_C_PACKAGE_TOO_LARGE = "DELIVERY.packageTooLarge",
  DLV_C_CLEAR_ISSUE = "DELIVERY.unableClearCache",

  // map
  MAP_OTHER = 'MAP.unknown',
  MAP_NOT_FOUND = 'MAP.notFound',
  MAP_BBOX_INVALID = 'MAP.bBoxIsInvalid',
  MAP_BBOX_NOT_IN_POLYGON = 'MAP.bBoxNotInAnyPolygon',
  GET_RECORDS_FAILED = 'MAP.getRecordsFailed',
  MAP_EXPORT_FAILED = 'MAP.exportMapFailed',
  MAP_REQUESTED_IN_PROCESSING = 'MAP.requestInProgress',
  MAP_AREA_TOO_LARGE = "MAP.areaTooLarge",
  MAP_AREA_TOO_SMALL = "MAP.areaTooSmall",

  // devices
  DEVICE_NOT_FOUND = "DEVICE.notFound",
  
  // groups
  GROUP_NOT_FOUND = "GROUP.notFound",
  GROUP_NOT_ALLOWED_TO_ADD = "GROUP.notAllowedToAdd",
}

export class ErrorDto {

  @ApiProperty({
    enum: ErrorCode,
    description:
      "`APP.unknown`: General Error code not listed in the enum.<br/>" +
      "`DELIVERY.unknown`: Error code not listed in the enum.<br/>" +
      "`DELIVERY.notFound`: Delivery with given catalog id not found.<br/>" +
      "`DELIVERY.download`: Download of delivery item failed.<br/>" +
      "`DELIVERY.downloadNotAvailable`: Delivery item not yet available for download.<br/>" +
      "`DELIVERY.notExist`: The package does not exist in storage.<br/>" +
      "`DELIVERY.invalid`: Package of given catalog id is invalid, maybe expired or otherwise.<br/>" +
      "`DELIVERY.notVerified`: Package of given catalog id is not verified, the package may be invalid.<br/>" +
      "`DELIVERY.packageTooLarge`: Package of given catalog id is too large, no space in cache.<br/>" +
      "`DELIVERY.unableClearCache`: Issue occurred when trying to clear cache.<br/>" +
      "`MAP.unknown`: Error code not listed in the enum.<br/>" +
      "`MAP.notFound`: Map with given id not found.<br/>" +
      "`MAP.bBoxIsInvalid`: BBox is invalid.<br/>" +
      "`MAP.bBoxNotInAnyPolygon`: The given BBox is not contained in any polygon.<br/>" +
      "`MAP.getRecordsFailed`: Failed to get records.<br/>" +
      "`MAP.exportMapFailed`: Error occurred when exporting map.<br/>" +
      "`MAP.requestInProgress`: Delivery was already requested and is processing.<br/>" +
      "`MAP.areaTooLarge`: Area too large to distribute, reduce request size and try again.<br/>" +
      "`MAP.areaTooSmall`: Area too small to distribute, increase request size and try again.<br/>" +
      "`DEVICE.notFound`: Device with given id not found.<br/>" +
      "`GROUP_NOT_FOUND`: Group with the given id was not found.<br/>" +
      "`GROUP_NOT_ALLOWED_TO_ADD`: Not allowed to add to the group, see message for cause.",
    required: false
  })
  @IsEnum(ErrorCode)
  errorCode: ErrorCode;

  @ApiProperty({ required: false })
  @IsString()
  message: string;

  static parseErrorCodeStrToEnum(errCode: string): ErrorCode {
    if (Object.values(ErrorCode).includes(errCode as ErrorCode)) {
      return errCode as ErrorCode;
    } else {
      Logger.warn(`invalid error code: ${errCode}`, ErrorDto.name)
      return ErrorCode.APP_OTHER
    }
  }

  static fromErrorDto(error: ErrorDto): ErrorDto {
    const errorDto = new ErrorDto();
    errorDto.errorCode = error.errorCode;
    errorDto.message = error.message;
    return errorDto
  }
}

export class AppError extends Error {
  errorCode: ErrorCode;
  statusCode?: number;

  constructor(errorCode: ErrorCode, message?: string, statusCode?: number) {
    super(message);
    this.name = "AppError";
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}


