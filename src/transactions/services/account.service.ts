import { Injectable, Logger } from '@nestjs/common';
import {
  DataSource,
  EntityNotFoundError,
  In,
  QueryFailedError,
  Repository,
  FindOptionsWhere,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import {
  Account,
  Gender,
  Transaction,
  TransactionType,
  User,
} from '../entities';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  AccountAlreadyExists,
  AccountNotFound,
  EmailAlreadyExists,
} from '../exceptions';

type CreateAccountWithUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: Gender;
  dob: string;
  accountNumber: string;
};

const uniqueQueryErrorPattern = new RegExp('(email|number)');

@Injectable()
export class AccountService {
  private logger = new Logger(AccountService.name);

  constructor(
    @InjectDataSource() private datasource: DataSource,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async generateAccountNumber(length = 10, prefix?: string) {
    const prefixLength = prefix?.length || 0;
    const randomNums = new Array(10).fill(null).map(() => {
      const randomNum = Math.random()
        .toString()
        .split('.')[1]
        .slice(prefixLength - length);

      return prefix + randomNum;
    });

    const existingAccounts = await this.accountRepo.findBy({
      number: In(randomNums),
    });
    const existingAccountsMap = new Map<string, boolean>();
    existingAccounts.forEach(({ number }) =>
      existingAccountsMap.set(number, true),
    );
    return randomNums.find((num) => !existingAccountsMap.get(num));
  }

  async createAccountWithUser(data: CreateAccountWithUserData) {
    try {
      return await this.accountRepo.save({
        number: data.accountNumber,
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          gender: data.gender,
          dob: data.dob,
        },
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        this.logger.error(`Conflict error while creating account with user`);

        const conflictingField = error.driverError.detail.match(
          uniqueQueryErrorPattern,
        )[0];
        if (conflictingField === 'email') {
          throw new EmailAlreadyExists();
        } else {
          throw new AccountAlreadyExists();
        }
      }

      throw error;
    }
  }

  fetchUserAccounts(user: User) {
    return this.accountRepo.findBy({ user: { id: user.id } });
  }

  async getAccount(accountNumber: string) {
    try {
      return this.accountRepo.findOneByOrFail({ number: accountNumber });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new AccountNotFound();
      }

      throw error;
    }
  }

  async fundAccount(account: Account, amount: number) {
    const queryRunner = this.datasource.createQueryRunner();
    let err: Error;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager
        .getRepository(Account)
        .createQueryBuilder('user')
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where('id = :id', { id: account.id })
        .getOne();

      const accountRepo = queryRunner.manager.getRepository(Account);
      const transactionRepo = queryRunner.manager.getRepository(Transaction);

      await accountRepo
        .createQueryBuilder('account')
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where('id = :id', { id: account.id })
        .getOne();

      const accountTransaction = new Transaction();
      accountTransaction.account = account;
      accountTransaction.amount = amount;
      accountTransaction.type = TransactionType.credit;

      account.balance = amount + Number(account.balance);

      await transactionRepo.save([accountTransaction]);
      await accountRepo.save([account]);
      await queryRunner.commitTransaction();
    } catch (error) {
      err = error;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (typeof err !== 'undefined') {
      this.logger.error('Error funding account', err.stack);

      throw new Error('Transaction failed');
    }
  }

  async transferFund(sender: Account, recipient: Account, amount: number) {
    const queryRunner = this.datasource.createQueryRunner();
    let err: Error;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager
        .getRepository(Account)
        .createQueryBuilder('user')
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where('id = :id', { id: recipient.id })
        .getOne();

      const accountRepo = queryRunner.manager.getRepository(Account);
      const transactionRepo = queryRunner.manager.getRepository(Transaction);

      await accountRepo
        .createQueryBuilder('account')
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where('id = :id', { id: sender.id })
        .getOne();

      await accountRepo
        .createQueryBuilder('account')
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where('id = :id', { id: recipient.id })
        .getOne();

      const senderTransaction = new Transaction();
      senderTransaction.account = sender;
      senderTransaction.recipient = recipient;
      senderTransaction.amount = amount;
      senderTransaction.type = TransactionType.debit;

      sender.balance = Number(sender.balance) - amount;

      const recipientTransaction = new Transaction();
      recipientTransaction.account = recipient;
      recipientTransaction.sender = sender;
      recipientTransaction.amount = amount;
      recipientTransaction.type = TransactionType.credit;

      recipient.balance = amount + Number(recipient.balance);

      await transactionRepo.save([senderTransaction, recipientTransaction]);
      await accountRepo.save([sender, recipient]);
      await queryRunner.commitTransaction();
    } catch (error) {
      err = error;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (typeof err !== 'undefined') {
      this.logger.error('Error effecting transaction', err.stack);

      throw new Error('Transaction failed');
    }
  }

  fetchAccountTransactions(
    account: Account,
    offset: number,
    limit: number,
    startDate: Date,
    endDate: Date,
  ) {
    const filters: FindOptionsWhere<Transaction> = {
      account: { id: account.id },
    };

    if (typeof startDate !== 'undefined' && typeof endDate !== 'undefined') {
      filters.createdAt = Between(startDate, endDate);
    } else if (typeof startDate !== 'undefined') {
      filters.createdAt = MoreThanOrEqual(startDate);
    } else if (typeof endDate !== 'undefined') {
      filters.createdAt = LessThanOrEqual(endDate);
    }

    return this.transactionRepo.findAndCount({
      where: filters,
      skip: offset,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
