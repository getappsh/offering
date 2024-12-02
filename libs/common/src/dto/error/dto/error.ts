import { ApiProperty, } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";


export enum ErrorCode {
  MAP_OTHER = 'MAP.unknown',
  MAP_NOT_FOUND = 'MAP.notFound',
  MAP_BBOX_INVALID = 'MAP.bBoxIsInvalid',
  MAP_BBOX_NOT_IN_POLYGON = 'MAP.bBoxNotInAnyPolygon',
  MAP_EXPORT_FAILED = 'MAP.exportMapFailed',
  MAP_REQUESTED_IN_PROCESSING = 'MAP.requestInProgress',
  MAP_AREA_TOO_LARGE = "MAP.areaTooLarge",
  MAP_AREA_TOO_SMALL = "MAP.areaTooSmall",
}

export class ErrorDto {

  @ApiProperty({
    enum: ErrorCode, description:
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
}


