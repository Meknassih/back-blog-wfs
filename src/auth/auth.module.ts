import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { SignupController } from './signup/signup.controller';
import { User } from './entities/user.entity';
import { ResponseService } from './services/response.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [LoginController, SignupController],
  providers: [
    UserService,
    ResponseService
  ]
})
export class AuthModule { }
