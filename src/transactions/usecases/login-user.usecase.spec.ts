import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserUsecase } from './login-user.usecase';

describe('LoginUserUsecase', () => {
  let provider: LoginUserUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginUserUsecase],
    }).compile();

    provider = module.get<LoginUserUsecase>(LoginUserUsecase);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
