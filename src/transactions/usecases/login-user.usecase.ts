import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../services';
import { LoginUserRequestDto } from '../dtos/request.dtos';
import { AuthUtils } from '../utils';
import { InvalidAuthenticationCredential } from '../exceptions';
import { User } from '../entities';

@Injectable()
export class LoginUserUsecase {
  private logger = new Logger(LoginUserUsecase.name);

  constructor(
    private authUtils: AuthUtils,
    private userService: UserService,
  ) {}

  async execute(dto: LoginUserRequestDto): Promise<[User, string]> {
    this.logger.log(`Attempting to log user in with email "${dto.email}"...`);

    const user = await this.userService.getUserByEmail(dto.email);
    const hasValidPassword = await this.authUtils.verifyPassword(
      dto.password,
      user.password,
    );

    if (!hasValidPassword) {
      this.logger.log('User password invalid');
      throw new InvalidAuthenticationCredential('Incorrect email or password');
    }

    const token = this.authUtils.signJWT({ userId: user.id });

    this.logger.log('Successfully logged in user');

    return [user, token];
  }
}
