import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MemberProjectEntity } from "./member_project.entity";
import { ProjectEntity } from "./project.entity";


@Entity("member")
export class MemberEntity extends BaseEntity{
    
    @Column({name: "first_name"})
    firstName: string;

    @Column({name: "last_name"})
    lastName: string;

    @Index("member_email_unique_constraint", {unique: true})
    @Column({name: "email"})
    email: string;

    @OneToMany(() => MemberProjectEntity, memberProject => memberProject)
    memberProjects: MemberProjectEntity[];

    @ManyToOne(() => ProjectEntity)
    @JoinColumn({name: "default_project"})
    defaultProject: ProjectEntity

    toString(){
        return JSON.stringify(this)
    }

}
