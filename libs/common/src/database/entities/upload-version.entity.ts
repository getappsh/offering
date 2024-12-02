import { Entity, Column, Unique, ManyToOne, ManyToMany, BeforeInsert, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { UploadStatus } from "./enums.entity";
import { ProjectEntity } from "./project.entity";
import {v4 as uuidv4} from 'uuid'
import { DeviceEntity } from "./device.entity";

@Entity('upload_version')
@Unique('platform_component_formation_version_unique_constraint', ['platform', 'component', 'formation', 'version'])
export class UploadVersionEntity{

    @PrimaryColumn({name: 'catalog_id'})
    catalogId: string
  
    @BeforeInsert()
    generateUUID() {
      this.catalogId = uuidv4();
    }

    // TODO make sure no one use this column and delete it;
    @Column({default: null})
    id: number;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    lastUpdatedDate: Date;

    @Column({name: "platform"})
    platform: string;

    @Column({name: 'component'})
    component: string

    @Column({name: "formation"})
    formation: string

    @Column({name: 'OS', default: null})
    OS: string;

    @Column ({name: 'virtual_size', default: 0})
    virtualSize: number

    @Column ({name: 'version'})
    version: string

    @Column ({name: 'base_version', default: null})
    baseVersion: string

    @Column ({name: 'prev_version', default: null})
    prevVersion: string

    @Column('jsonb',{name: 'metadata', default: {}})
    metadata: any

    @Column({name: 's3_url', nullable: true})
    s3Url: string

    @Column({
        name: 'upload_status',
        type: "enum",
        enum: UploadStatus,
        default: UploadStatus.STARTED
      })
    uploadStatus: string

    @Column({name: "deployment_status", nullable: true})
    deploymentStatus: string

    @Column({name: "security_status", nullable: true})
    securityStatus: string

    @Column({name: "policy_status", nullable: true})
    policyStatus: string

    @ManyToOne(() => ProjectEntity)
    project: ProjectEntity

    @ManyToMany(() => DeviceEntity, deviceEntity => deviceEntity.components)
    devices: DeviceEntity[]

    static fromArtifact({platform, component, formation, OS, version, project, size=0, ...metadata}){
        const newVersion = new UploadVersionEntity()
        newVersion.platform = platform;
        newVersion.component = component;
        newVersion.formation = formation;
        newVersion.OS = OS;
        newVersion.version = version;
        newVersion.baseVersion = metadata['baseVersion'] || null
        newVersion.prevVersion = metadata['prevVersion'] || null
        newVersion.project = project;
        newVersion.virtualSize = size;
                
        newVersion.metadata = metadata;      

        return newVersion
    }

    static fromManifest({product, name, formation, version, project, url, size=0, ...metadata}){
        const newVersion = new UploadVersionEntity()
        newVersion.platform = product;
        newVersion.component = name;
        newVersion.formation = formation;
        newVersion.version = version;
        newVersion.baseVersion = metadata['baseVersion'] || null
        newVersion.prevVersion = metadata['prevVersion'] || null
        newVersion.project = project;
        newVersion.s3Url = url;
        newVersion.virtualSize = size;

        newVersion.metadata = metadata;

        return newVersion;
    }

    toString(){
        return JSON.stringify(this)
    }

}