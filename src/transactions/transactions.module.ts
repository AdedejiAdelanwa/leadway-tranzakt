import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { TransactionsAPI } from './apis';
import {
  FetchAccountsUsecase,
  FetchTransactionsUsecase,
  FundAccountUsecase,
  LoginUserUsecase,
  RegisterUserUsecase,
  TransferFundUsecase,
} from './usecases';
import { AuthUtils } from './utils';
import { AccountService, UserService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Transaction, User } from './entities';
import { TransactionsController } from './controllers/transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Transaction])],
  providers: [
    AuthUtils,
    UserService,
    AccountService,
    RegisterUserUsecase,
    LoginUserUsecase,
    FetchAccountsUsecase,
    FundAccountUsecase,
    TransferFundUsecase,
    FetchTransactionsUsecase,
    TransactionsAPI,
  ],
  controllers: [AuthController, TransactionsController],
})
export class TransactionsModule {}
