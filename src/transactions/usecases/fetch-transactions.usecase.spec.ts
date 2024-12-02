import { Test, TestingModule } from '@nestjs/testing';
import { FetchTransactionsUsecase } from './fetch-transactions.usecase';

describe('FetchTransactionsUsecase', () => {
  let provider: FetchTransactionsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchTransactionsUsecase],
    }).compile();

    provider = module.get<FetchTransactionsUsecase>(FetchTransactionsUsecase);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
