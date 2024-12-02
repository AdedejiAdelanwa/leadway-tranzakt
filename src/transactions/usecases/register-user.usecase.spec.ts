import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUsecase } from './register-user.usecase';

describe('RegisterUserUsecase', () => {
  let provider: RegisterUserUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterUserUsecase],
    }).compile();

    provider = module.get<RegisterUserUsecase>(RegisterUserUsecase);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
