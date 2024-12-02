import { Injectable } from '@nestjs/common';
import {
  LoginUserRequestDto,
  RegisterUserRequestDto,
  TransferFundRequestDto,
} from './dtos/request.dtos';
import {
  FetchAccountsUsecase,
  FetchTransactionsUsecase,
  FundAccountUsecase,
  LoginUserUsecase,
  RegisterUserUsecase,
  TransferFundUsecase,
} from './usecases';
import { User } from './entities';

@Injectable()
export class TransactionsAPI {
  constructor(
    private registerUserUsecase: RegisterUserUsecase,
    private loginUserUsecase: LoginUserUsecase,
    private fetchAccountsUsecase: FetchAccountsUsecase,
    private fundAccountUsecase: FundAccountUsecase,
    private transferFundUsecase: TransferFundUsecase,
    private fetchTransactionsUsecase: FetchTransactionsUsecase,
  ) {}

  registerUser(dto: RegisterUserRequestDto) {
    return this.registerUserUsecase.execute(dto);
  }

  loginUser(dto: LoginUserRequestDto) {
    return this.loginUserUsecase.execute(dto);
  }

  fetchAccounts(user: User) {
    return this.fetchAccountsUsecase.execute(user);
  }

  fundAccount(user: User, amount: number) {
    return this.fundAccountUsecase.execute(user, amount);
  }

  transferFund(user: User, dto: TransferFundRequestDto) {
    return this.transferFundUsecase.execute(user, dto);
  }

  fetchTransactions(
    user: User,
    offset: number,
    limit: number,
    startDate: Date,
    endDate: Date,
  ) {
    return this.fetchTransactionsUsecase.execute(
      user,
      offset,
      limit,
      startDate,
      endDate,
    );
  }
}
