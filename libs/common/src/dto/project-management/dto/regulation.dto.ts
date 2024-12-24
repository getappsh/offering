import { ApiProperty } from '@nestjs/swagger';
import { RegulationEntity } from '@app/common/database/entities';
import { RegulationTypeDto } from './regulation-type.dto';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class RegulationDto {
    @ApiProperty({ description: 'ID of the regulation' })
    id: number;

    @ApiProperty({ description: 'Name of the regulation' })
    name: string;

    @ApiProperty({ description: 'Description of the regulation' })
    description: string;

    @ApiProperty({ description: 'Type of the regulation' , type: RegulationTypeDto})
    type: RegulationTypeDto;

    @ApiProperty({ description: 'Project associated with the regulation' })
    projectId: number;

    @ApiProperty({ description: 'Configuration of the regulation', required: false })
    config?: string;

    @ApiProperty({ description: 'Order of the regulation' })
    order: number;

    fromRegulationEntity(regulation: RegulationEntity) {
        this.id = regulation.id;
        this.name = regulation.name;
        this.description = regulation.description;
        this.type = regulation.type;
        this.projectId = regulation?.project?.id;
        this.config = regulation.config;
        this.order = regulation.order;
        return this;
    }

    toString() {
        return JSON.stringify(this);
    }
}

export class CreateRegulationDto {
    @ApiProperty({ description: 'Name of the regulation' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Description of the regulation', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'ID of the regulation type' })
    @IsNotEmpty()
    @IsNumber()
    typeId: number;

    @ApiProperty({ description: 'ID of the project' })
    @IsNotEmpty()
    @IsNumber()
    projectId: number;

    @ApiProperty({ description: 'Configuration of the regulation', required: false })
    @IsOptional()
    @IsString()
    config?: string;

    @ApiProperty({ description: 'Order of the regulation', default: 0, required: false })
    @IsOptional()
    @IsNumber()
    order?: number;
}


export class UpdateRegulationDto {

    id: number;

    @ApiProperty({ description: 'Name of the regulation', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Description of the regulation', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'ID of the regulation type', required: false })
    @IsOptional()
    @IsNumber()
    typeId?: number;

    @ApiProperty({ description: 'Configuration of the regulation', required: false })
    @IsOptional()
    @IsString()
    config?: string;

    @ApiProperty({ description: 'Order of the regulation', required: false })
    @IsOptional()
    @IsNumber()
    order?: number;
}