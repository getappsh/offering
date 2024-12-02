import { ApiProperty } from "@nestjs/swagger";
import { PlatformDto } from "@app/common/dto/discovery";


export class OfferingResponseDto{
    @ApiProperty({required: false})
    isNewVersion: boolean;

    @ApiProperty({required: false})
    platform: PlatformDto;

    toString(){
        return JSON.stringify(this)
    }
}