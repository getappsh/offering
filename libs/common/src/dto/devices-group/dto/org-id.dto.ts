import { OrgUIDEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class OrgIdDto {

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  orgId: number;

  toString() {
    return JSON.stringify(this);
  }
}

export class OrgIdRefDto extends OrgIdDto {

  @ApiProperty({ required: false, type: String, nullable: true, description: "Device id related to the org id. Set to null to remove the current device." })
  @IsOptional()
  @IsString()
  device?: string | null;

  @ApiProperty({ required: false, type: Number, nullable: true, description: "Group parent id for the org id. Set to null to remove the current group parent." })
  @IsOptional()
  @IsNumber()
  group?: number | null;

  toString() {
    return JSON.stringify(this);
  }

  static fromOrgIdEntity(orgIdEntity: OrgUIDEntity): OrgIdRefDto {
    const dto = new OrgIdRefDto();
    dto.orgId = orgIdEntity.UID;
    dto.device = orgIdEntity.device?.ID;
    dto.group = orgIdEntity.group?.id;
    return dto;
  }

  static fromRaw(raw: any): OrgIdRefDto {
    const dto = new OrgIdRefDto();
    dto.orgId = raw.orgid;
    dto.device = raw.deviceid ?? null;
    dto.group = raw.groupid ?? null;
    return dto;
  }

}

export class OrgIdPutDto {

  orgId: number;

  @ApiProperty({ required: false, type: String, nullable: true, description: "Device id related to the org id. Set to null to remove the current device." })
  @IsOptional()
  @IsString()
  device?: string | null;

  @ApiProperty({ required: false, type: Number, nullable: true, description: "Group parent id for the org id. Set to null to remove the current group parent." })
  @IsOptional()
  @IsNumber()
  group?: number | null;

  toString() {
    return JSON.stringify(this);
  }
}
