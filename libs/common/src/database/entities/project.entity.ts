import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MemberProjectEntity } from "./member_project.entity";
import { CategoryEntity, FormationEntity, OperationSystemEntity, PlatformEntity } from "./project-types";


@Entity("project")
export class ProjectEntity extends BaseEntity{
    
    @Index("project_component_name_unique_constraint", {unique: true})
    @Column({name: "component_name"})
    componentName: string;

    @ManyToOne(() => OperationSystemEntity, OS => OS.name)
    @JoinColumn({name: "OS"})
    OS: OperationSystemEntity;

    @ManyToOne(() => PlatformEntity, platformType => platformType.name)
    @JoinColumn({name: "platform_type"})
    platformType: PlatformEntity;

    @ManyToOne(() => FormationEntity, formation => formation.name)
    @JoinColumn({name: "formation"})
    formation: FormationEntity;

    @Column({name: "artifact_type", default: null})
    artifactType: string;

    @ManyToOne(() => CategoryEntity, category => category.name)
    @JoinColumn({name: "category"})
    category: CategoryEntity;

    @Column({name: "description"})
    description: string
    
    @Column('simple-array', {name: "tokens", nullable: true})
    tokens: string[]
   
    @OneToMany(() => MemberProjectEntity, memberProject => memberProject)
    memberProject: MemberProjectEntity[];

    toString(){
        return JSON.stringify(this)
    }
}