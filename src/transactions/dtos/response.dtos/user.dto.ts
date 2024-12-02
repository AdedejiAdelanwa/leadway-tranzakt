import { ApiResponseProperty } from '@nestjs/swagger';
import { Gender } from 'src/transactions/entities';

export class UserResponseDto {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty({ format: 'email' })
  email: string;

  @ApiResponseProperty()
  gender: keyof typeof Gender;

  @ApiResponseProperty({ format: 'date' })
  dob: Date;

  @ApiResponseProperty()
  token: string;
}
