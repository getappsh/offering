import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, ArrayMinSize } from "class-validator";

export class DeviceDeploymentDetailDto {
  @ApiProperty({ description: 'Device ID', type: String })
  deviceId: string;

  @ApiProperty({ description: 'Device name', type: String, required: false })
  deviceName?: string;

  @ApiProperty({ description: 'Delivery status (e.g., DONE, PENDING, IN_PROGRESS)', type: String, required: false })
  deliveryStatus?: string;

  @ApiProperty({ description: 'Deploy/Installation status (e.g., DONE, PENDING, IN_PROGRESS)', type: String, required: false })
  deployStatus?: string;

  @ApiProperty({ description: 'Download completion timestamp', type: Date, required: false })
  downloadTime?: Date;

  @ApiProperty({ description: 'Installation completion timestamp', type: Date, required: false })
  installationTime?: Date;
}

export class DeploymentReportDto {
  @ApiProperty({ description: 'Project ID', type: Number })
  projectId: number;

  @ApiProperty({ description: 'Release name', type: String })
  releaseName: string;

  @ApiProperty({ description: 'Release version', type: String })
  version: string;

  @ApiProperty({ description: 'Number of devices that have downloaded the release', type: Number })
  downloadedCount: number;

  @ApiProperty({ description: 'Number of devices with the release installed', type: Number })
  installedCount: number;

  @ApiProperty({ description: 'Total number of devices with ongoing delivery process (includes devices waiting for download and mid-deployment)', type: Number })
  total: number;

  @ApiProperty({ description: 'Number of devices that are pending (not downloaded or still downloading)', type: Number })
  pending: number;

  @ApiProperty({ description: 'Deployment percentage calculated as (installedCount / activeDeliveryCount) * 100', type: Number })
  deploymentPercentage: number;

  @ApiProperty({ description: 'List of devices with their deployment statuses', type: [DeviceDeploymentDetailDto] })
  devices: DeviceDeploymentDetailDto[];
}
