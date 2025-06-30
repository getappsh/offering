import { PrepareStatusEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { DeliveryItemDto } from "./delivery-item.dto";
import { IsOptional } from "class-validator";
import { ErrorDto } from "../../error";
import { Deprecated } from "@app/common/decorators";


export class PrepareDeliveryResDto {
  @ApiProperty()
  catalogId: string;

  @ApiProperty({ enum: PrepareStatusEnum })
  status: PrepareStatusEnum

  @ApiProperty({ required: false })
  progress: number

  @ApiProperty({ required: false })
  size: number

  /**
    * @deprecated This field is deprecated and will be removed in the future.
    */
  @ApiProperty({ required: false, deprecated: true })
  @Deprecated()
  url: string;

  @ApiProperty({ required: false, type: [DeliveryItemDto] })
  private artifacts: DeliveryItemDto[];

  get Artifacts(): DeliveryItemDto[] {
    return this.artifacts;
  }

  set Artifacts(artifacts: DeliveryItemDto[]) {
    if (this.hasUniqueKeys(artifacts, 'itemKey')) {
      this.artifacts = artifacts;
    } else {
      throw new Error('Artifacts contain non-unique keys');
    }
  }

  @ApiProperty({ required: false })
  @IsOptional()
  error: ErrorDto

  private hasUniqueKeys(array: DeliveryItemDto[], key: keyof DeliveryItemDto): boolean {
    const keys = array.map(item => item[key]);
    const uniqueKeys = new Set(keys);
    return keys.length === uniqueKeys.size;
  }


  toString() {
    return JSON.stringify(this);
  }

  static fromPrepareDeliveryResDto(dDto: PrepareDeliveryResDto): PrepareDeliveryResDto {
    const dlvResDto = new PrepareDeliveryResDto();
    dlvResDto.catalogId = dDto.catalogId;
    dlvResDto.status = dDto.status;
    dlvResDto.progress = dDto.progress;
    dlvResDto.size = dDto.size;
    dlvResDto.url = dDto.url;

    if (dDto.artifacts && Array.isArray(dDto.artifacts)) {
      dlvResDto.Artifacts = dDto.artifacts.map((artifact: DeliveryItemDto) => DeliveryItemDto.fromDeliveryItemDto(artifact));
    }

    if (dDto.error) {
      dlvResDto.error = ErrorDto.fromErrorDto(dDto.error);
    }

    return dlvResDto;
  }
}