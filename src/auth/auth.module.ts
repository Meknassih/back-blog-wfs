import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/services/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [LoginController],
  providers: [
    UserService
  ]
})
export class AuthModule { }
