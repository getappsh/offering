import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RegulationTypeEntity } from "./regulation-type.entity";
import { ProjectEntity } from "./project.entity";
import { RegulationStatusEntity } from "./regulation-status.entity";

@Entity('regulation')
export class RegulationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({name: 'description', default: null})
    description: string;

    @ManyToOne(() => RegulationTypeEntity, { eager: true })
    type: RegulationTypeEntity;

    @ManyToOne(() => ProjectEntity, (project) => project.regulations, { onDelete: 'CASCADE' })
    project: ProjectEntity;

    @Column({ nullable: true })
    config: string;

    @Column({ default: 0 })
    order: number;

    @OneToMany(() => RegulationStatusEntity, status => status.regulation)
    statuses: RegulationStatusEntity[];
}