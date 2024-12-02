import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from 'src/configs';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';

@Injectable()
export class AuthUtils {
  private bcryptSaltRounds = this.configService.get('bcryptSaltRound', {
    infer: true,
  });
  private jwtConfig = this.configService.get('jwt', { infer: true });

  constructor(private configService: ConfigService<IConfiguration>) {}

  hashPassword(password: string): Promise<string> {
    return bcryptHash(password, this.bcryptSaltRounds);
  }

  verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcryptCompare(password, hashedPassword);
  }

  signJWT(payload: { userId: string }): string {
    return jwtSign(payload, this.jwtConfig.authTokenSecret, {
      expiresIn: `${this.jwtConfig.authTokenExpiryInMinutes}m`,
    });
  }

  verifyJWT(token: string): { userId: string } {
    return jwtVerify(token, this.jwtConfig.authTokenSecret) as {
      userId: string;
    };
  }
}
