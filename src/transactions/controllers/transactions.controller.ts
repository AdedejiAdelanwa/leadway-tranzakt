import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/utils';
import { TransactionsAPI } from '../apis';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { TokenInterceptor } from '../interceptors';
import { AccountResponseDto } from '../dtos/response.dtos/account.dto';
import {
  FundAccountRequestDto,
  TransferFundRequestDto,
} from '../dtos/request.dtos';
import { TransactionsResponseDto } from '../dtos/response.dtos';
import { TransactionType } from '../entities';
import { InvalidTransaction } from '../exceptions';

@Controller('transactions')
export class TransactionsController {
  private logger = new Logger(TransactionsController.name);

  constructor(private transactionsAPI: TransactionsAPI) {}

  @ApiBearerAuth()
  @Get('accounts')
  @UseInterceptors(TokenInterceptor)
  async fetchAccounts(
    @Req() req: AuthenticatedRequest,
  ): Promise<AccountResponseDto[]> {
    try {
      const accounts = await this.transactionsAPI.fetchAccounts(req.user);

      return accounts.map((account) => ({
        id: account.id,
        number: account.number,
        balance: account.balance,
      }));
    } catch (error) {
      this.logger.error('Unexpected error', error.stack);
      throw new InternalServerErrorException('An unexepected error occurred');
    }
  }

  @ApiBearerAuth()
  @Post('fund')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(TokenInterceptor)
  async fundAccount(
    @Req() req: AuthenticatedRequest,
    @Body() dto: FundAccountRequestDto,
  ): Promise<void> {
    try {
      await this.transactionsAPI.fundAccount(req.user, dto.amount);
    } catch (error) {
      this.logger.error('Unexpected error', error.stack);
      throw new InternalServerErrorException('An unexepected error occurred');
    }
  }

  @ApiBearerAuth()
  @Post('transfer')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(TokenInterceptor)
  async transferFund(
    @Req() req: AuthenticatedRequest,
    @Body() dto: TransferFundRequestDto,
  ): Promise<void> {
    try {
      await this.transactionsAPI.transferFund(req.user, dto);
    } catch (error) {
      if (error instanceof InvalidTransaction) {
        throw new ForbiddenException(error.message);
      }

      this.logger.error('Unexpected error', error.stack);
      throw new InternalServerErrorException('An unexepected error occurred');
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: TransactionsResponseDto })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'startDate', type: Date, required: false })
  @ApiQuery({ name: 'endDate', type: Date, required: false })
  @Get('transactions')
  @UseInterceptors(TokenInterceptor)
  async fetchTransactions(
    @Req() req: AuthenticatedRequest,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<TransactionsResponseDto> {
    try {
      const [transactions, totalCount] =
        await this.transactionsAPI.fetchTransactions(
          req.user,
          offset,
          limit,
          startDate,
          endDate,
        );

      return {
        items: transactions.map((txn) => ({
          ref: txn.id,
          amount: txn.amount,
          type: TransactionType[txn.type] as keyof typeof TransactionType,
          account: {
            id: txn.account.id,
            number: txn.account.number,
            balance: txn.account.balance,
          },
          sender: txn.sender && {
            id: txn.sender?.id,
            number: txn.sender?.number,
            bearerName: `${txn.sender?.user?.firstName} ${txn.sender?.user?.lastName}`,
          },
          recipient: txn.recipient && {
            id: txn.recipient?.id,
            number: txn.recipient?.number,
            bearerName: `${txn.recipient?.user?.firstName} ${txn.recipient?.user?.lastName}`,
          },
          createdAt: txn.createdAt,
        })),
        offset,
        limit,
        totalCount,
        hasMore: offset + transactions.length < totalCount,
      };
    } catch (error) {
      this.logger.error('Unexpected error', error.stack);
      throw new InternalServerErrorException('An unexepected error occurred');
    }
  }
}
