
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../database/entities/base.entity";

@Entity("cache_config")
export class CacheConfigEntity extends BaseEntity {
 
  @Column("jsonb", { name: "configs" })
  configs: string;

}