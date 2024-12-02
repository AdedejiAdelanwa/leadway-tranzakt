import { Injectable, Logger } from '@nestjs/common';
import { AccountService, UserService } from '../services';
import { RegisterUserRequestDto } from '../dtos/request.dtos';
import { AuthUtils } from '../utils';
import { Gender, User } from '../entities';

@Injectable()
export class RegisterUserUsecase {
  private logger = new Logger(RegisterUserUsecase.name);

  constructor(
    private authUtils: AuthUtils,
    private userService: UserService,
    private accountService: AccountService,
  ) {}

  async execute(dto: RegisterUserRequestDto): Promise<[User, string]> {
    this.logger.log(
      `Attempting to register user with email: "${dto.email}"...`,
    );
    const password = await this.authUtils.hashPassword(dto.password);
    const accountNumber = await this.accountService.generateAccountNumber(
      10,
      '010',
    );
    const account = await this.accountService.createAccountWithUser({
      ...dto,
      password,
      accountNumber,
      gender: Gender[dto.gender],
    });
    const jwt = this.authUtils.signJWT({ userId: account.user.id });

    this.logger.log('Successfully registered user');

    return [account.user, jwt];
  }
}
