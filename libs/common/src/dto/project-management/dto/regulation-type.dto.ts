import { ApiProperty } from '@nestjs/swagger';

export class RegulationTypeDto {
    @ApiProperty({ description: 'ID of the regulation type' })
    id: number;

    @ApiProperty({ description: 'Name of the regulation type' })
    name: string;

    @ApiProperty({ description: 'Description of the regulation type' })
    description: string;


    toString(){
        return JSON.stringify(this)
    }
    
}