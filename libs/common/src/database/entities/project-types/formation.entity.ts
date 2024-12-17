import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("formation")
export class FormationEntity{

    @PrimaryColumn()
    name: string;
    
    toString(){
        return JSON.stringify(this);
    }
}
