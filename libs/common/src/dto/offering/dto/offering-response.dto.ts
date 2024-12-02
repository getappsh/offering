import { ApiProperty } from "@nestjs/swagger";
import { PlatformDto } from "@app/common/dto/discovery";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";


export class OfferingResponseDto {
    @ApiProperty({ required: false })
    isNewVersion: boolean;

    @ApiProperty({ required: false, type: PlatformDto })
    @ValidateNested()
    @Type(() => PlatformDto)
    platform: PlatformDto;

    toString() {
        return JSON.stringify(this)
    }
}