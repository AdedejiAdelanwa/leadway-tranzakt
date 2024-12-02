import { Test, TestingModule } from '@nestjs/testing';
import { FundAccountUsecase } from './fund-account.usecase';

describe('FundAccountUsecase', () => {
  let provider: FundAccountUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundAccountUsecase],
    }).compile();

    provider = module.get<FundAccountUsecase>(FundAccountUsecase);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
