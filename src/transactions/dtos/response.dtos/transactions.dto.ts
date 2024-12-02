import { ApiResponseProperty } from '@nestjs/swagger';
import { AccountResponseDto as TransactionBearerDto } from './account.dto';
import { TransactionType } from 'src/transactions/entities';

const TransactionTypes: (keyof typeof TransactionType)[] = ['credit', 'debit'];

class AccountDto {
  @ApiResponseProperty({ format: 'uuid' })
  id: string;

  @ApiResponseProperty()
  number: string;

  @ApiResponseProperty()
  bearerName: string;
}

class TransactionItemDto {
  @ApiResponseProperty({ format: 'uuid' })
  ref: string;

  @ApiResponseProperty()
  amount: number;

  @ApiResponseProperty({ enum: TransactionTypes })
  type: keyof typeof TransactionType;

  @ApiResponseProperty({ type: TransactionBearerDto })
  account: TransactionBearerDto;

  @ApiResponseProperty({ type: AccountDto })
  sender?: AccountDto;

  @ApiResponseProperty({ type: AccountDto })
  recipient: AccountDto;

  @ApiResponseProperty({ format: 'date-time' })
  createdAt: Date;
}

export class TransactionsResponseDto {
  @ApiResponseProperty({ type: [TransactionItemDto] })
  items: TransactionItemDto[];

  @ApiResponseProperty()
  offset: number;

  @ApiResponseProperty()
  limit: number;

  @ApiResponseProperty()
  hasMore: boolean;

  @ApiResponseProperty()
  totalCount: number;
}
