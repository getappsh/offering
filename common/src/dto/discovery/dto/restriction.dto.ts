import { ApiProperty } from "@nestjs/swagger";
import { RuleType } from "@app/common/rules/enums/rule.enums";

export class RestrictionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: RuleType })
  type: RuleType;

  @ApiProperty()
  version: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ description: 'The restriction rule object' })
  rule: any;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
