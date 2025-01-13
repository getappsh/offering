import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RegulationTypeEntity } from "./regulation-type.entity";
import { ProjectEntity } from "./project.entity";
import { RegulationStatusEntity } from "./regulation-status.entity";

@Entity('regulation')
@Index(["project", "name"], { unique: true })
export class RegulationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'name'})
    name: string;

    @Column({name: 'display_name', default: null})
    displayName: string;

    @Column({name: 'description', default: null})
    description: string;

    @ManyToOne(() => RegulationTypeEntity, { eager: true })
    @JoinColumn({name: 'type_id'})
    type: RegulationTypeEntity;

    @ManyToOne(() => ProjectEntity, (project) => project.regulations, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'project_id'})
    project: ProjectEntity;

    @Column({name: 'config', nullable: true })
    config: string;

    @Column({ name: 'order', default: 0 })
    order: number;

    @OneToMany(() => RegulationStatusEntity, status => status.regulation)
    @JoinColumn({name: 'statues'})
    statuses: RegulationStatusEntity[];
}