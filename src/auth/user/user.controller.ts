import { Controller, Get, HttpException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ResponseService } from '../services/response.service';
import { User } from '../entities/user.entity';

/**
 * Handles user operations
 * @constructs UserController
 * @param {UserService} userService
 * @param {ResponseService} responseService
 */
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService
  ) { }

  /**
   * Returns the current user
   * @function getUser
   * @returns {(User|undefined)}
   */
  @Get()
  getUser(): User | HttpException {
    const user = this.userService.getCurrentUser();
    if (user)
      return user;
    else
      this.responseService.notLoggedIn(); // TODO: implement this
  }

  /**
   * Returns all the existing users
   * @async
   * @function users
   * @returns {Promise<User[]>}
   */
  @Get('all')
  async all(): Promise<User[]> {
    return this.userService.all();
  }
}
