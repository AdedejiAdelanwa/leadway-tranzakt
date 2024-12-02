import { Injectable, Logger } from '@nestjs/common';
import { AccountService } from '../services';
import { Account, User } from '../entities';

@Injectable()
export class FetchAccountsUsecase {
  private logger = new Logger(FetchAccountsUsecase.name);

  constructor(private accountService: AccountService) {}

  async execute(user: User): Promise<Account[]> {
    this.logger.log('Attempting to fetch accounts for user...');

    const accounts = await this.accountService.fetchUserAccounts(user);

    this.logger.log('Successfully fetch accounts for user');

    return accounts;
  }
}
