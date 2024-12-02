import { Injectable, Logger } from '@nestjs/common';
import { AccountService } from '../services';
import { User } from '../entities';
import { TransferFundRequestDto } from '../dtos/request.dtos';
import { InvalidTransaction } from '../exceptions';

@Injectable()
export class TransferFundUsecase {
  private logger = new Logger(TransferFundUsecase.name);

  constructor(private accountService: AccountService) {}

  async execute(user: User, dto: TransferFundRequestDto) {
    this.logger.log(`Attempting to transfer fund for user ID="${user.id}..."`);

    const senderAccount = (
      await this.accountService.fetchUserAccounts(user)
    )[0];

    if (senderAccount.balance < dto.amount) {
      this.logger.log('Account balance lower than transfer amount');
      throw new InvalidTransaction(
        'Transfer amount greater than account balance',
      );
    }

    const recipientAccount = await this.accountService.getAccount(
      dto.recipient,
    );

    await this.accountService.transferFund(
      senderAccount,
      recipientAccount,
      dto.amount,
    );

    this.logger.log(`Successfully transfered fund for user ID="${user.id}"`);
  }
}
