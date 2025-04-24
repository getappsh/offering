import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MemberProjectEntity } from "./member_project.entity";
import { RegulationEntity } from "./regulation.entity";
import { ReleaseEntity } from "./release.entity";
import { ProjectTokenEntity } from "./project-token.entity";
import { DocEntity } from "./document.entity";
import { PlatformEntity } from "./platform.entity";
import { ProjectType } from "./enums.entity";

@Entity("project")
export class ProjectEntity extends BaseEntity{
    
    @Index("project_name_unique_constraint", {unique: true})
    @Column({name: "name"})
    name: string;

    @Column({name: "description"})
    description: string
   
    @OneToMany(() => ProjectTokenEntity, (token) => token.project)
    tokens: ProjectTokenEntity[];

    @ManyToMany(() => PlatformEntity, { eager: true })
    @JoinTable({
        name: "project_platforms",
        joinColumn: { name: "project_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "platform_name", referencedColumnName: "name" },
    })
    platforms: PlatformEntity[];

    @OneToMany(() => RegulationEntity, regulation => regulation.project)
    regulations: RegulationEntity[]
    
    @OneToMany(() => MemberProjectEntity, memberProject => memberProject.project)
    memberProject: MemberProjectEntity[];

    @OneToMany(() => ReleaseEntity, release => release.project)
    releases: ReleaseEntity[];
    
    @Column({ type: "jsonb", nullable: true, name: "project_summary", default: {} })
    projectSummary: Record<string, any>;

    
    @OneToMany(() => DocEntity, (doc) => doc.project, {lazy: true})
    docs: Promise<DocEntity[]>;

    @Column({name : "project_type", type: "enum", enum: ProjectType, default: ProjectType.PRODUCT })
    projectType: ProjectType;

    toString(){
        return JSON.stringify(this)
    }
}