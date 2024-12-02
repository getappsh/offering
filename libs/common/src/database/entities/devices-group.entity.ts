import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { BaseEntity } from "./base.entity";

@Entity("devices_group")
export class DevicesGroupEntity extends BaseEntity{

    @Column({name: 'name', nullable: false, unique: true})
    name: string;

    @Column({name: 'description', nullable: true})
    description: string;

    @OneToMany(type => DeviceEntity, (device) => device.groups)
    devices: DeviceEntity[];

    @ManyToOne(type => DevicesGroupEntity, {nullable: true})
    parent: DevicesGroupEntity

    @OneToMany(type => DevicesGroupEntity, (dvcGrp) => dvcGrp.parent)
    children: DevicesGroupEntity[]
    
}