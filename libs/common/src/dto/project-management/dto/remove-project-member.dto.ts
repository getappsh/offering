import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsEmail } from "class-validator";

export class RemoveProjectMemberDto{
    
    @IsNumber()
    @ApiProperty({required: false})
    projectId: number;

    @IsEmail()
    @ApiProperty({required: false})
    email: string;
}