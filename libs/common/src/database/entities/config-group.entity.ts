import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ConfigRevisionEntity } from './config-revision.entity';

/**
 * A named group within a config revision.
 *
 * The group's entire configuration is stored as a YAML string in `yamlContent`,
 * allowing complex nested objects without normalisation overhead.
 *
 * A group with `isGlobal = true` is automatically merged into every other group
 * when building the final device configuration (globals group).
 *
 * `gitFilePath` links the group to a YAML file in the associated git repository
 * (GitOps integration). When set, entries are synced from the file contents.
 *
 * `sensitiveKeys` lists dot-notation key paths whose values are stored in Vault
 * when Vault is enabled (e.g. `["password", "credentials.token"]`).
 * Those positions in `yamlContent` hold Vault reference strings instead of
 * plaintext.  The API always masks these values as `***` in responses.
 */
@Entity('config_group')
export class ConfigGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ConfigRevisionEntity, (rev) => rev.groups, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'revision_id' })
  revision: ConfigRevisionEntity;

  @Column({ name: 'revision_id' })
  revisionId: number;

  @Column({ name: 'name' })
  name: string;

  /**
   * Optional human-readable display name for the group shown in UI contexts.
   * Falls back to `name` when not set.
   */
  @Column({ name: 'display_name', type: 'varchar', nullable: true })
  displayName: string | null;

  /**
   * When true, this group's parsed YAML is automatically merged into every other
   * group of the same revision (and the device's merged config view).
   */
  @Column({ name: 'is_global', type: 'boolean', default: false })
  isGlobal: boolean;

  /**
   * Optional path to a YAML file inside the linked git repository.
   * When provided the GitOps sync will populate yamlContent from that file.
   */
  @Column({ name: 'git_file_path', type: 'varchar', nullable: true })
  gitFilePath: string | null;

  /**
   * The group's configuration stored as a complete YAML string.
   * Values at paths listed in `sensitiveKeys` are replaced with Vault
   * reference strings when Vault is enabled.
   */
  @Column({ name: 'yaml_content', type: 'text', nullable: true })
  yamlContent: string | null;

  /**
   * Dot-notation key paths whose values are treated as sensitive.
   * e.g. ["password", "credentials.token", "db.password"]
   * Those values are stored in Vault (when enabled) and masked (`***`) in
   * API responses.  Empty array = no sensitive keys.
   */
  @Column({ name: 'sensitive_keys', type: 'jsonb', default: [] })
  sensitiveKeys: string[];

  /**
   * Explicit display order within a revision. Lower values appear first.
   * New groups are assigned the next available position (appended to end).
   */
  @Column({ name: 'position', type: 'int', default: 0 })
  position: number;
}
