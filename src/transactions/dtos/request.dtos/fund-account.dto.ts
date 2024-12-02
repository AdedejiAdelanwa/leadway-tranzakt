import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class FundAccountRequestDto {
  @ApiProperty()
  @Min(50)
  amount: number;
}
