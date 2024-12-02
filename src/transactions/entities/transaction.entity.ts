import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../utils';
import { Account } from './account.entity';

export enum TransactionType {
  credit,
  debit,
}

@Entity('account_transaction')
export class Transaction extends BaseModel {
  @ManyToOne(() => Account, { nullable: false, eager: true })
  account: Account;

  @Column({ type: 'numeric', scale: 2 })
  amount: number;

  @Column({ enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => Account, { nullable: true, eager: true })
  sender?: Account;

  @ManyToOne(() => Account, { nullable: true, eager: true })
  recipient?: Account;
}
