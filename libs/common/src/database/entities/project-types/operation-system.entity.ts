import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("operation_system")
export class OperationSystemEntity{

    @PrimaryColumn()
    name: string;
    
    toString(){
        return JSON.stringify(this);
    }
}
