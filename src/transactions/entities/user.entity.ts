import { Column, Entity } from 'typeorm';
import { BaseModel } from '../utils';

export enum Gender {
  male,
  female,
}

@Entity('auth_user')
export class User extends BaseModel {
  @Column({ length: 150 })
  firstName: string;

  @Column({ length: 150 })
  lastName: string;

  @Column({ length: 250, unique: true })
  email: string;

  @Column({
    enum: Gender,
  })
  gender: Gender;

  @Column({ type: 'timestamp' })
  dob: Date;

  @Column()
  password: string;
}
