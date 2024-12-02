import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseModel } from '../utils';

@Entity('account')
export class Account extends BaseModel {
  @OneToOne(() => User, { cascade: true, nullable: false, eager: true })
  @JoinColumn()
  user: User;

  @Column({ length: 10, unique: true })
  number: string;

  @Column({ type: 'numeric', scale: 2, default: 0 })
  balance: number;
}
