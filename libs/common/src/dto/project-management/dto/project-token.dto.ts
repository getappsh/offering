import { ApiProperty } from "@nestjs/swagger";

export class ProjectTokenDto {
    @ApiProperty({required: false})
    projectToken: string

    toString(){
        return JSON.stringify(this);
    }
}