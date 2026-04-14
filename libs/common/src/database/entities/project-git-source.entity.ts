import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProjectEntity } from "./project.entity";

@Entity("project_git_source")
export class ProjectGitSourceEntity extends BaseEntity {

    @OneToOne(() => ProjectEntity, project => project.gitSource, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: ProjectEntity;

    @Column({ name: 'clone_url', type: 'varchar' })
    cloneUrl: string;

    @Column({ name: 'ssh_key', nullable: true, type: 'text' })
    sshKey?: string | null;

    @Column({ name: 'webhook_url', nullable: true, type: 'varchar' })
    webhookUrl?: string;

    @Column({ name: 'clone_interval', nullable: true, type: 'integer' })
    cloneInterval?: number;

    @Column({ name: 'branch', nullable: true, type: 'varchar' })
    branch?: string;

    @Column({ name: 'https_username', nullable: true, type: 'varchar' })
    httpsUsername?: string | null;

    @Column({ name: 'https_password', nullable: true, type: 'text' })
    httpsPassword?: string | null;

    @Column({ name: 'getapp_file_path', nullable: true, type: 'varchar' })
    getappFilePath?: string;

    toString() {
        return JSON.stringify(this)
    }
}
