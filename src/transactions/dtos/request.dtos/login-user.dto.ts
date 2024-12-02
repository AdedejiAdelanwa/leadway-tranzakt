import { PickType } from '@nestjs/swagger';
import { RegisterUserRequestDto } from './register-user.dto';

export class LoginUserRequestDto extends PickType(RegisterUserRequestDto, [
  'password',
  'email',
]) {}
