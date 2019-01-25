import { Test, TestingModule } from '@nestjs/testing';
import { SignupController } from './signup.controller';

describe('Signup Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SignupController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SignupController = module.get<SignupController>(SignupController);
    expect(controller).toBeDefined();
  });
});
