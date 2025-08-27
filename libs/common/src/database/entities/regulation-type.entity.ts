import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('regulation_type')
export class RegulationTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'name'})
    name: string;

    @Column({name: 'description', default: null})
    description: string;
}