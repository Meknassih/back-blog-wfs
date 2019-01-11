import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { UserDto } from 'src/models/user';

@Controller('login')
export class LoginController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post()
  async login(@Body('username') username, @Body('password') password) {
    this.userService.findOneWithAttributes({ username, password }).then(user => {
      return user;
    });
  }
}
