import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { RegulationEntity } from "./regulation.entity";
import { ReleaseEntity } from "./release.entity";

@Entity("regulation_status")
@Unique("regulation_version_unique_constraint", ['regulation', 'version'])
export class RegulationStatusEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ReleaseEntity, (release) => release, {nullable: false})
    @JoinColumn({name: "version_id"})
    version: ReleaseEntity

    @ManyToOne(() => RegulationEntity, (regulation) => regulation.statuses, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: "regulation_id" })
    regulation: RegulationEntity;

    @Column({ name: 'regulation_snapshot', type: 'jsonb', default: null })
    regulationSnapshot: Record<string, any>;

    @Column({ name: "is_compliant", default: false })
    isCompliant: boolean;

    @Column({ name: "value", default: null })
    value: string;

    @Column({ name: "report_details", default: null })
    reportDetails: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
    
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
}
