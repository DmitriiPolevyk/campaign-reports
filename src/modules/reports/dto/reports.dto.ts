import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsDate, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReportsDto {
  @ApiProperty({
    description: 'From date',
    example: '2025-03-04 00:00:00',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  from_date: Date;

  @ApiProperty({
    description: 'To date',
    example: '2025-03-04 23:59:59',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  to_date: Date;

  @ApiProperty({
    description: 'Event name',
    example: 'install',
  })
  @IsString()
  event_name: string;

  @ApiProperty({
    description: 'Records count per page',
    example: 100,
    minimum: 1,
    maximum: 1000,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  @Max(1000)
  take: number;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1)
  page: number;
}

export class ReportsPaginationDto extends OmitType(ReportsDto, ['page']) {
  @IsInt()
  @Min(0)
  skip: number;
}
