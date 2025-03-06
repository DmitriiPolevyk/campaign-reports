import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReportsFetchDto {
  @ApiProperty({
    description: 'From date',
    example: '2025-03-04 00:00:00',
  })
  @IsString()
  from_date: string;

  @ApiProperty({
    description: 'To date',
    example: '2025-03-04 23:59:59',
  })
  @IsString()
  to_date: string;
}
