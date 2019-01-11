import { Controller, Post, Body } from '@nestjs/common';

@Controller('login')
export class LoginController {
  @Post()
  login(@Body('username') username, @Body('password') password) {

  }
}
