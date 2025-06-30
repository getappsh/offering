import { CacheConfigEntity } from "@app/common/database-tng/entities/cache-config.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";


export class CacheConfigDto {
  @ApiProperty({ description: "The maximum cache capacity in GB" })
  @IsOptional()
  maxCapacityInGB: number;

  toString() {
    return JSON.stringify(this);
  }

  static fromCacheConfigEntity(entity: CacheConfigEntity) {
    if (typeof entity.configs === "string") {
      entity.configs = JSON.parse(entity.configs)
    }

    const configDto = new CacheConfigDto();
    configDto.maxCapacityInGB = entity.configs["maxCapacityInGB"]
    return configDto
  }
}