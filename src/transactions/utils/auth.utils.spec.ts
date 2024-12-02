import { Test, TestingModule } from '@nestjs/testing';
import { AuthUtils } from './auth.utils';

describe('AuthUtils', () => {
  let provider: AuthUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthUtils],
    }).compile();

    provider = module.get<AuthUtils>(AuthUtils);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
