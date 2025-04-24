import { Entity, PrimaryColumn } from "typeorm";

@Entity("platform")
export class PlatformEntity {

  @PrimaryColumn({ name: "name" })
  name: string;
}
