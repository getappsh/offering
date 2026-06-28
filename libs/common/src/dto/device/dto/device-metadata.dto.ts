import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { GeoLocationDto } from '../../discovery/dto/discovery-general.dto';

export { GeoLocationDto };

/** Mirrors agent DeliverySource enum */
export enum DeliverySource {
  Cache = 'cache',
  Remote = 'remote',
}

/** Mirrors agent BatteryStatus */
export class BatteryStatusDto {
  @ApiProperty({ type: 'integer', format: 'uint16', description: 'Battery level as a percentage (0–100)' })
  @IsNumber()
  level: number;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  isPluggedIn?: boolean;

  @ApiProperty({ type: 'integer', format: 'uint16', description: 'Battery health as a percentage (0–100)', required: false })
  @IsOptional()
  @IsNumber()
  health?: number;

  @ApiProperty({ type: 'integer', format: 'uint32', description: 'Estimated time remaining in minutes', required: false })
  @IsOptional()
  @IsNumber()
  timeRemainingMinutes?: number;

  @ApiProperty({ type: String, description: 'Battery state: Charging | Discharging | Full | Empty | Unknown' })
  @IsString()
  state: string;

  @ApiProperty({ type: Boolean, description: 'Whether this is a virtual/emulated battery', required: false })
  @IsOptional()
  @IsBoolean()
  isVirtual?: boolean;

  toString() {
    return JSON.stringify(this)
  }
}

/** Mirrors agent DeviceMetaData — physical and operational device properties */
export class DeviceMetaDataDto {
  @ApiProperty({ type: String, description: 'MAC address', required: false })
  @IsOptional()
  @IsString()
  macAddress?: string;

  @ApiProperty({ type: String, description: 'IP address', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ type: String, description: 'Device name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: () => GeoLocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location?: GeoLocationDto;

  @ApiProperty({ type: String, description: 'Operating system', required: false })
  @IsOptional()
  @IsString()
  os?: string;

  @ApiProperty({ type: String, description: 'OS release version', required: false })
  @IsOptional()
  @IsString()
  osRelease?: string;

  @ApiProperty({ type: Number, description: 'Available storage in bytes', required: false })
  @IsOptional()
  @IsNumber()
  storageAvailable?: number;

  @ApiProperty({ type: () => BatteryStatusDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => BatteryStatusDto)
  battery?: BatteryStatusDto;

  @ApiProperty({ type: String, description: 'Currently active GetApp server URL', required: false })
  @IsOptional()
  @IsString()
  urlGetAppServerActive?: string;

  // Index signature — keeps TypeScript structural compatibility with the agent's serde-flattened map.
  // Note: `additionalProperties: true` and the class description are injected at runtime via
  // the `patchSchemas` post-processor in apps/api/src/main.ts (not settable via decorators in @nestjs/swagger v6).
  [key: string]: any;

  toString() {
    return JSON.stringify(this)
  }
}

/**
 * Body DTO for POST /:deviceId/metadata.
 * Mirrors agent DeviceMetaDataSet — partial update (only settable fields).
 */
export class DeviceOrchestrationResDto {
  @ApiProperty({ type: String, description: 'Orchestrated by identifier', required: false })
  @IsOptional()
  @IsString()
  orchestrated_by?: string;

  @ApiProperty({ type: String, description: 'Orchestrator identifier', required: false })
  @IsOptional()
  @IsString()
  orchestratorId?: string;

  [key: string]: any;
}

/**
 * Response DTO for GET/POST /:deviceId/metadata.
 */
export class DeviceDataDto {
  // ── Snapshot ──────────────────────────────────────────────────────────────

  @ApiProperty({ type: Date, description: 'Timestamp of the last metadata snapshot', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  snapshotDate?: Date;

  // ── Device Enrollment ───────────────────────────────────────────────────────

  @ApiProperty({ type: String, description: 'Device identifier', required: false })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({ type: [String], description: 'Device type tokens', required: false })
  @IsOptional()
  deviceType?: string[];

  @ApiProperty({ type: String, description: 'Platform identifier', required: false })
  @IsOptional()
  @IsString()
  platformId?: string;

  @ApiProperty({ type: String, description: 'Platform name', required: false })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ type: [String], description: 'Available GetApp server URLs', required: false })
  @IsOptional()
  urlGetAppServerAvailable?: string[];

  @ApiProperty({ type: String, description: 'Delivery source mode', required: false })
  @IsOptional()
  @IsString()
  deliverySource?: string;

  @ApiProperty({ type: Boolean, description: 'When true, requests that a master agent orchestrate this device', required: false })
  @IsOptional()
  @IsBoolean()
  orchestrateMe?: boolean;

  @ApiProperty({ type: Boolean, description: 'When true, the device subscribes to the master SSE command channel', required: false })
  @IsOptional()
  @IsBoolean()
  reactiveMode?: boolean;

  @ApiProperty({ type: String, description: 'Master device-id that is currently orchestrating this device', required: false })
  @IsOptional()
  @IsString()
  orchestratedBy?: string;

  @ApiProperty({ type: String, description: 'Orchestrator identifier', required: false })
  @IsOptional()
  @IsString()
  orchestratorId?: string;

  // ── DeviceMetaData ────────────────────────────────────────────────────────

  @ApiProperty({ type: () => DeviceMetaDataDto, required: false })
  @IsOptional()
  // @ValidateNested() intentionally omitted: metadata carries arbitrary extra properties
  // from the device agent. Enabling @ValidateNested() causes ValidationPipe whitelist:true
  // to recurse into DeviceMetaDataDto and strip any property that lacks a decorator.
  @Type(() => DeviceMetaDataDto)
  metadata?: DeviceMetaDataDto;

  toString() {
    return JSON.stringify(this)
  }
}

