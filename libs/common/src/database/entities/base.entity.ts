import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export abstract class BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: 'timestamptz'})
  createdDate: Date;

  @UpdateDateColumn({type: 'timestamptz'})
  lastUpdatedDate: Date;
}