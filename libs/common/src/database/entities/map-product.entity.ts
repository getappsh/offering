import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("map_product")
@Index("id_type_ingestion_date_unique", ["id", "productType", "ingestionDate"], { unique: true })
export class ProductEntity {
  
  @PrimaryGeneratedColumn({name: "pk_id"})
  PK_Id: string;
  
  @CreateDateColumn({name: 'create_date'})
  createDateTime: Date;

  @UpdateDateColumn()
  lastUpdatedDate: Date;

  @Column({name: 'id'})
  id: string;
  
  @Column({name: 'product_id'})
  productId: string;

  @Column({name: 'product_name', nullable: true})
  productName: string;

  @Column({name: 'product_version', nullable: true})
  productVersion: number;

  @Column({name: 'product_type', nullable: true})
  productType: string;

  @Column({name: 'product_sub_type', nullable: true})
  productSubType: number;

  @Column({name: 'description', nullable: true})
  description: string;

  @Column({name: 'imaging_time_begin_UTC', type: 'timestamptz', nullable: true})
  imagingTimeBeginUTC: Date;

  @Column({name: 'imaging_time_end_UTC', type: 'timestamptz', nullable: true})
  imagingTimeEndUTC: Date;

  @Column({name: 'max_resolution_deg', type: "float8", nullable: true})
  maxResolutionDeg: number

  @Column({name: 'footprint'})
  footprint: string;

  @Column({name: 'transparency', nullable: true})
  transparency: string
 
  @Column({name: 'region', nullable: true})
  region: string;

  @Column({name: 'ingestionDate', type: 'timestamptz', nullable: true})
  ingestionDate: Date;
  
  @Column({name: 'is_checked_against_maps', type: 'timestamptz', nullable: true})
  isCheckedAgainstMaps: Date;

  toString(){
    return JSON.stringify(this)
  }
}
