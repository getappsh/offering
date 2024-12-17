import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { OrgUIDEntity } from "./org-uid.entity";

@Entity("org_groups")
export class OrgGroupEntity extends BaseEntity {

    @Column({ name: 'name', nullable: false, unique: true })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @OneToMany(type => OrgUIDEntity, (uid) => uid.group)
    orgUID: OrgUIDEntity[];

    @ManyToOne(type => OrgGroupEntity, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "parent_id" })
    parent: OrgGroupEntity

    @OneToMany(type => OrgGroupEntity, (dvcGrp) => dvcGrp.parent)
    children: OrgGroupEntity[]

}