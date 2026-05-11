import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { BaseEntity } from "./base.entity";

/**
 * Tracks which CONFIG project device IDs an agent device should download configs for.
 * configDeviceId is the deviceId of the device whose CONFIG project the agent should sync.
 * The agent calls GET /v2/device/device-config/:configDeviceId to download each config.
 */
@Entity("config_offering")
@Unique('device_config_offering_unique_constraint', ['device', 'configDeviceId'])
export class ConfigOfferingEntity extends BaseEntity {

  @ManyToOne(() => DeviceEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "device_ID" })
  device: DeviceEntity;

  @Column({ name: "config_device_id", type: "varchar", nullable: false })
  configDeviceId: string;
}
