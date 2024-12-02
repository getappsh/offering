import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("device_config")
export class DeviceConfigEntity extends BaseEntity {

  @Column({ name: 'data', type: 'json', default: () => "'{}'::json"})
  data: object;

  @Column({name: 'group'})
  group: string
}