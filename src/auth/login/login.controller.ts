import { Controller, Post, Body } from '@nestjs/common';

@Controller('login')
export class LoginController {
  @Post()
  login(@Body() body) {
    return body;
  }
}
