import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("platform")
export class PlatformEntity{

    @PrimaryColumn()
    name: string;
    
    toString(){
        return JSON.stringify(this);
    }
}
