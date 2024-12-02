import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, Unique } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { BaseEntity } from "./base.entity";
import { customAlphabet } from "nanoid";
import { OrgGroupEntity } from "./org-group.entity";

@Entity("org_uid")
// @Index("IDX_DEVICE", ["device"]) // Create an index on the device field
export class OrgUIDEntity extends BaseEntity {

    // @BeforeInsert()
    // generateUID() {
    //     const id = customAlphabet("0123456789", 16);
    //     this.UID = Number(id);
    // }
    @Column({ name: 'UID', nullable: false, unique: true })
    UID: number;

    @ManyToOne(type => OrgGroupEntity, {onDelete: "SET NULL",  nullable: true })
    @JoinColumn({ name: "group_id" }) // Define the foreign key column
    group: OrgGroupEntity

    @OneToOne(type => DeviceEntity, {onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "device_id" }) // Define the foreign key column
    device: DeviceEntity;

}