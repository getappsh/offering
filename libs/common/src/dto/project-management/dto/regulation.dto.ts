import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RegulationEntity } from '@app/common/database/entities';
import { RegulationTypeDto } from './regulation-type.dto';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidStringFor } from '@app/common/validators';
import { Pattern } from '@app/common/validators/regex.validator';
import { ProjectIdentifierParams } from './project-identifier.dto';

export class RegulationDto {
    @ApiProperty({ description: 'Name of the regulation' })
    name: string;

    @ApiProperty({ description: 'Display name of the regulation' })
    displayName: string;

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
        this.name = regulation.name;
        this.displayName = regulation?.displayName;
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
    projectIdentifier: string | number;

    projectId: number;

    @ApiProperty({ description: 'Name of the regulation' })
    @IsNotEmpty()
    @IsString()
    @IsValidStringFor(Pattern.SINGLE_WORD)
    name: string;

    @ApiProperty({required: false, description: 'Display name of the regulation' })
    @IsString()
    @IsOptional()
    displayName?: string;

    @ApiProperty({ description: 'Description of the regulation', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'ID of the regulation type' })
    @IsNotEmpty()
    @IsNumber()
    typeId: number;

    @ApiProperty({ description: 'Configuration of the regulation', required: false })
    @IsOptional()
    @IsString()
    config?: string;

    @ApiProperty({ description: 'Order of the regulation', default: 0, required: false })
    @IsOptional()
    @IsNumber()
    order?: number;
}


export class UpdateRegulationDto extends PartialType(CreateRegulationDto) {
    regulation: string;
}


export class UpdateOneOfManyRegulationDto extends PartialType(CreateRegulationDto) {
    @ApiProperty({ description: 'Identifier (name) of the regulation' })
    @IsString()
    @IsNotEmpty()
    regulation: string;   
}



export class RegulationParams extends ProjectIdentifierParams{

    @ApiProperty({ description: 'Name of the regulation' })
    @IsString()
    @Type(() => String)
    regulation: string;

    toString() {
        return JSON.stringify(this);
    }
}


export enum RegulationChangedEventType {
    CREATED = 'created',
    UPDATED = 'updated',
    DELETED = 'deleted'
}
export class RegulationChangedEvent{

    projectId: number;

    regulation: string;

    type: RegulationChangedEventType;

}

