import { Injectable, Logger } from '@nestjs/common';
import { AccountService } from '../services';
import { Transaction, User } from '../entities';

@Injectable()
export class FetchTransactionsUsecase {
  private logger = new Logger(FetchTransactionsUsecase.name);

  constructor(private accountService: AccountService) {}

  async execute(
    user: User,
    offset = 0,
    limit = 50,
    endDate: Date,
    startDate: Date,
  ): Promise<[Transaction[], number]> {
    this.logger.log(
      `Attempting to fetch transactions for user ID="${user.id}"...`,
    );

    const account = (await this.accountService.fetchUserAccounts(user))[0];

    const [transactions, totalCount] =
      await this.accountService.fetchAccountTransactions(
        account,
        offset,
        limit,
        startDate,
        endDate,
      );

    this.logger.log(`Successfully fetch transactions for user ID="${user.id}"`);

    return [transactions, totalCount];
  }
}
