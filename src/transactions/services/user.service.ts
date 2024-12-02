import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UserNotFound } from '../exceptions';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getUserByEmail(email: string) {
    try {
      return await this.userRepo.findOneByOrFail({ email });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UserNotFound(`User with email "${email}" not found`);
      }

      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      return await this.userRepo.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UserNotFound(`User with ID "${id}" not found`);
      }

      throw error;
    }
  }
}
