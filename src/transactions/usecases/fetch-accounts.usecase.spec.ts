import { Test, TestingModule } from '@nestjs/testing';
import { FetchAccountsUsecase } from './fetch-accounts.usecase';

describe('FetchAccountsUsecase', () => {
  let provider: FetchAccountsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchAccountsUsecase],
    }).compile();

    provider = module.get<FetchAccountsUsecase>(FetchAccountsUsecase);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
