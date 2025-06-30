import { Entity, Column, Unique, ManyToOne, ManyToMany, BeforeInsert, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToMany } from "typeorm";
import { AssetTypeEnum, UploadStatus } from "./enums.entity";
import { ProjectEntity } from "./project.entity";
import { nanoid } from "nanoid";
import { DeviceEntity } from "./device.entity";
import { DeviceComponentEntity } from "./device-component-state.entity";

@Entity('upload_version')
@Unique('platform_component_formation_version_unique_constraint', ['platform', 'component', 'formation', 'version'])
export class UploadVersionEntity{

    @PrimaryColumn({name: 'catalog_id'})
    catalogId: string
  
    @BeforeInsert()
    generateUUID() {
      this.catalogId = nanoid();
    }

    @Column({name: "asset_type", type: "enum", enum: AssetTypeEnum, default: AssetTypeEnum.ARTIFACT})
    assetType: AssetTypeEnum

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

    @Column({name: 'url', nullable: true})
    url: string

    @Column({
        name: 'upload_status',
        type: "enum",
        enum: UploadStatus,
        default: UploadStatus.STARTED
      })
    uploadStatus: UploadStatus

    @Column({name: "deployment_status", nullable: true})
    deploymentStatus: string

    @Column({name: "security_status", nullable: true})
    securityStatus: string

    @Column({name: "policy_status", nullable: true})
    policyStatus: string

    @Column({name: "latest", default: false})
    latest: boolean

    @ManyToOne(() => ProjectEntity)
    project: ProjectEntity

    static fromArtifact({platform, component, formation, OS, version, project, size=0, ...metadata}){
        const newVersion = new UploadVersionEntity()
        newVersion.platform = platform;
        newVersion.component = component;
        newVersion.formation = formation;
        newVersion.OS = OS;
        newVersion.version = version;
        newVersion.baseVersion = metadata['baseVersion'] ?? null
        newVersion.prevVersion = metadata['prevVersion'] ?? null
        newVersion.project = project;
        newVersion.virtualSize = size;
                
        newVersion.metadata = metadata;      

        return newVersion
    }

    static fromManifest({product, name, formation, version, project, url, size=0, assetType=AssetTypeEnum.ARTIFACT, ...metadata}){
        const newVersion = new UploadVersionEntity()
        newVersion.platform = product;
        newVersion.component = name;
        newVersion.formation = formation;
        newVersion.version = version;
        newVersion.baseVersion = metadata['baseVersion'] ?? null
        newVersion.prevVersion = metadata['prevVersion'] ?? null
        newVersion.project = project;
        newVersion.url = url;
        newVersion.virtualSize = size;
        newVersion.assetType = assetType
        newVersion.metadata = metadata;

        return newVersion;
    }

    toString(){
        return JSON.stringify(this)
    }

}