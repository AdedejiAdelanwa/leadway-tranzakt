import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entities';
import { AccountService } from '../services';

@Injectable()
export class FundAccountUsecase {
  private logger = new Logger(FundAccountUsecase.name);

  constructor(private accountService: AccountService) {}

  async execute(user: User, amount: number) {
    this.logger.log(
      `Attempting to fund account for user ID="${user.id}" with amount "${amount}"...`,
    );

    const account = (await this.accountService.fetchUserAccounts(user))[0];

    await this.accountService.fundAccount(account, amount);

    this.logger.log(`Successfully funded account for user ID="${user.id}"`);
  }
}
