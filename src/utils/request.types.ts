import { Request } from 'express';
import { User } from 'src/transactions/entities';

export type AuthenticatedRequest = Request & {
  user: User;
};
