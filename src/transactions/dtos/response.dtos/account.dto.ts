import { ApiResponseProperty } from '@nestjs/swagger';

export class AccountResponseDto {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;

  @ApiResponseProperty()
  number: string;

  @ApiResponseProperty()
  balance: number;
}
