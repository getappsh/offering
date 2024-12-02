import { ApiProperty } from "@nestjs/swagger";
import { MapImportStatusEnum } from "@app/common/database/entities";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ErrorDto } from "../../error";
import { MapProperties } from "./create-import-dto";

export class ImportResDto {

  @ApiProperty({ required: false })
  importRequestId: string;

  @ApiProperty({ required: false, enum: MapImportStatusEnum })
  status: MapImportStatusEnum;

  @ApiProperty({ type: ErrorDto, required: false })
  error: ErrorDto

  toString() {
    return JSON.stringify(this);
  }
}