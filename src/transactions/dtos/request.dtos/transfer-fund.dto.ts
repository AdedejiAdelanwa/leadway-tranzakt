import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, MaxLength, Min, MinLength } from 'class-validator';

export class TransferFundRequestDto {
  @ApiProperty()
  @IsNumberString()
  @MinLength(10)
  @MaxLength(10)
  recipient: string;

  @ApiProperty()
  @Min(50)
  amount: number;
}
