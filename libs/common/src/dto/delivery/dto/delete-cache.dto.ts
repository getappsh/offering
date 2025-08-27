import { IsValidStringFor } from "@app/common/validators";
import { IsStringOrStringArr } from "@app/common/validators/is-str-or-str-arr.validator";
import { Pattern } from "@app/common/validators/regex.validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Validate } from "class-validator";

export class DeleteFromCacheDto {

  @ApiProperty({required:false})
  @IsOptional()
  @IsNumber()
  size: number

  @ApiProperty({required:false})
  @IsOptional()
  @IsValidStringFor(Pattern.Date)
  date: string

  @ApiProperty({required:false})
  @IsOptional()
  @Validate(IsStringOrStringArr)
  catalogId: string | string []
  

  static toString() {
    return JSON.stringify(this)
  }
}