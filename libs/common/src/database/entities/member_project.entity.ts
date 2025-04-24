import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProjectEntity } from "./project.entity";
import { MemberEntity } from "./member.entity";
import { RoleInProject } from "./enums.entity";

export enum MemberProjectStatusEnum {
    INVITED = "invited",
    ACTIVE = "active",
    INACTIVE = "inactive"
}



@Entity("member_project")
@Unique('member_project_unique_constraint', ['project', 'member'])
export class MemberProjectEntity extends BaseEntity {


    @ManyToOne(() => ProjectEntity, project => project.memberProject,  { onDelete: "CASCADE" })
    @JoinColumn()
    project: ProjectEntity

    @ManyToOne(() => MemberEntity, member => member.memberProjects)
    @JoinColumn()
    member: MemberEntity

    @Column({ name: "role", type: "enum", enum: RoleInProject, default: RoleInProject.PROJECT_MEMBER })
    role: RoleInProject

    @Column({ name: "status", type: "enum", enum: MemberProjectStatusEnum, default: MemberProjectStatusEnum.ACTIVE })
    status: MemberProjectStatusEnum

    @Column({ name: "pinned", default: false })
    pinned: boolean

    toString() {
        return JSON.stringify(this)
    }
}