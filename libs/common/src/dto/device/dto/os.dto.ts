import { ApiProperty } from '@nestjs/swagger';

export class OSDto {
  @ApiProperty({ example: 'android', description: 'Operating system identifier' })
  id: string;

  @ApiProperty({ example: 'Android', description: 'Operating system display name' })
  name: string;

  @ApiProperty({ example: 'Android mobile and tablet operating system', description: 'Operating system description', required: false })
  description?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}
