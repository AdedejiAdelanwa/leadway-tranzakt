import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthUtils } from '../utils';
import { UserService } from '../services';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(
    private authUtils: AuthUtils,
    private userService: UserService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;

    if (!token)
      throw new UnauthorizedException('Invalid authentication credentials');

    token = token.split(' ')[1];

    try {
      const tokenPayload = this.authUtils.verifyJWT(token);
      request.user = await this.userService.getUserById(tokenPayload.userId);
      return next.handle();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication credentials');
    }
  }
}
