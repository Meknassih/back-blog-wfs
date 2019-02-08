import { Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ResponseService } from '../services/response.service';
import { User, UserType } from '../entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleGuard } from '../guards/role.guard';

/**
 * Handles user operations
 * @constructs UserController
 * @param {UserService} userService
 * @param {ResponseService} responseService
 */
@Controller('user')
@UseGuards(AuthGuard, RoleGuard)
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
    return this.userService.getCurrentUser();
  }

  /**
   * Returns all the existing users
   * @async
   * @function users
   * @returns {Promise<User[]>}
   */
  @Get('all')
  @Roles(UserType.ADMIN)
  async all(): Promise<User[]> {
    return this.userService.all();
  }
}
