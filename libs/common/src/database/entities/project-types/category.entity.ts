import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("category")
export class CategoryEntity{

    @PrimaryColumn()
    name: string;
    
    toString(){
        return JSON.stringify(this);
    }
}
