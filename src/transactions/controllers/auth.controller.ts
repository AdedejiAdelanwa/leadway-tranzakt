import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginUserRequestDto,
  RegisterUserRequestDto,
} from '../dtos/request.dtos';
import { TransactionsAPI } from '../apis';
import { UserResponseDto } from '../dtos/response.dtos';
import { Gender } from '../entities';
import {
  EmailAlreadyExists,
  InvalidAuthenticationCredential,
  UserNotFound,
} from '../exceptions';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private transactionAPI: TransactionsAPI) {}

  @Post('register')
  async registerUser(
    @Body() dto: RegisterUserRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const [user, jwt] = await this.transactionAPI.registerUser(dto);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: Gender[user.gender] as keyof typeof Gender,
        dob: user.dob,
        token: jwt,
      };
    } catch (error) {
      if (error instanceof EmailAlreadyExists) {
        this.logger.log(`Email "${dto.email}" already exists`);
        throw new ConflictException('Email already exists');
      }

      this.logger.error('Error:', error.stack);
      throw new InternalServerErrorException();
    }
  }

  @Post('login')
  async login(@Body() dto: LoginUserRequestDto): Promise<UserResponseDto> {
    try {
      const [user, jwt] = await this.transactionAPI.loginUser(dto);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dob: user.dob,
        gender: Gender[user.gender] as keyof typeof Gender,
        token: jwt,
      };
    } catch (error) {
      if (
        error instanceof InvalidAuthenticationCredential ||
        error instanceof UserNotFound
      ) {
        this.logger.log('Invalid Authentication Credentials');
        throw new UnauthorizedException('Invalid email/password');
      }

      this.logger.error('Error:', error.stack);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
