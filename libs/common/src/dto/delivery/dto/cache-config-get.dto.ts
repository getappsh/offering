import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CacheConfigDto } from "./cache-config.dto";


export class CacheConfigResDto extends CacheConfigDto {

  @ApiProperty({ description: "The used cache capacity in GB" })
  @IsOptional()
  usedCapacityGB: number;

  @ApiProperty({ description: "The free cache capacity in GB" })
  @IsOptional()
  freeCapacityGB: number;

  @ApiProperty({
    description: "A message or additional information",
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
    ],
  })
  @IsOptional()
  mes: string | string[]

  toString() {
    return JSON.stringify(this);
  }

  static fromMsg(msg: string | string[]) {
    const configDto = new CacheConfigResDto();
    configDto.mes = msg
    return configDto
  }
}