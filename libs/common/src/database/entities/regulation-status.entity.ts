import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { RegulationEntity } from "./regulation.entity";
import { UploadVersionEntity } from "./upload-version.entity";

@Entity("regulation_status")
@Unique("regulation_version_unique_constraint",['regulation', 'version'])
export class RegulationStatusEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => UploadVersionEntity, (version) => version)
    version: UploadVersionEntity

    @ManyToOne(() => RegulationEntity, (regulation) => regulation)
    regulation: RegulationEntity;

    @Column({default: false})
    isCompliant: boolean;

    @Column({ default: null })
    value: string;

    @Column({ default: null })
    reportDetails: string;
}
