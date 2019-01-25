import { Controller, Post, Body } from '@nestjs/common';
import { UserDto } from 'src/models/user';
import { UserService } from '../services/user.service';

@Controller('signup')
export class SignupController {
  constructor(
    private userService: UserService
  ) { }

}
