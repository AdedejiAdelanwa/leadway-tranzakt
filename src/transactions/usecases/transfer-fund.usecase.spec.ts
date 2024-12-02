import { Test, TestingModule } from '@nestjs/testing';
import { TransferFundUsecase } from './transfer-fund.usecase';

describe('TransferFundUsecase', () => {
  let provider: TransferFundUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferFundUsecase],
    }).compile();

    provider = module.get<TransferFundUsecase>(TransferFundUsecase);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
