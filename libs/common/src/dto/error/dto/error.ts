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
}

export class ErrorDto {

  @ApiProperty({
    enum: ErrorCode, description:
      "`APP.unknown`: General Error code not listed in the enum <br /> " +

      "`DELIVERY.unknown`: Error code not listed in the enum <br /> " +
      "`DELIVERY.notFound`: No found the delivery with given catalog id <br /> " +
      "`DELIVERY.download`: Download of delivery item failed <br /> " +
      "`DELIVERY.downloadNotAvailable`: Delivery item not yet available for download <br /> " +
      "`DELIVERY.notExist`: The Package not exist in storage <br /> " +
      "`DELIVERY.invalid`: Package of given catalog id is invalid, maybe expired or some else <br /> " +
      "`DELIVERY.notVerified`: Package of given catalog id is not verified, the package can be in valid <br /> " +
      "`DELIVERY.packageTooLarge`:  Package of given catalog id is too large, no space in cache<br /> " +
      "`DELIVERY.unableClearCache`:  Some issue occurs when trying to clear cache <br /> " +

      "`MAP.unknown`: Error code not listed in the enum <br /> " +
      "`MAP.notFound`: No found the map with given id <br /> " +
      "`MAP.bBoxIsInvalid`: BBox is probably invalid <br /> " +
      "`MAP.bBoxNotInAnyPolygon`: The given BBox in not contains in any polygon <br /> " +
      "`MAP.exportMapFailed`: Some error occurs when import map <br /> " +
      "`MAP.requestInProgress`: Delivery was already requested and in processing! <br /> " +
      "`MAP.areaTooLarge`: Area too large to distribute, reduce request size and try again <br /> " +
      "`MAP.areaTooSmall`: Area too small to distribute, increase request size and try again . ",
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


