import { Controller, Get, HttpException, UseGuards, Delete, Body, Patch } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ResponseService } from '../services/response.service';
import { User, UserType } from '../entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleGuard } from '../guards/role.guard';
import { UserDto } from 'src/models/user';

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
   * @function all
   * @returns {Promise<User[]>}
   */
  @Get('all')
  @Roles(UserType.ADMIN)
  async all(): Promise<User[]> {
    return this.userService.all();
  }

  /**
   * Updates the current user with the new data
   * @function updateCurrentUser
   * @returns {(User|undefined)}
   */
  @Patch()
  async updateCurrentUser(@Body() userPart: Partial<UserDto>): Promise<User> {
    return await this.userService.updateCurrentUser(userPart);
  }

  /**
   * Deletes permenently a user
   * @async
   * @function delete
   * @returns {Promise<boolean>}
   */
  @Delete()
  @Roles(UserType.ADMIN)
  async delete(@Body('username') username: string): Promise<HttpException> {
    if (!username || typeof username !== 'string' || username === '')
      return this.responseService.deletionUnsuccessful();

    const deleteResult = await this.userService.delete(username);

    if (deleteResult.raw.affectedRows > 0)
      return this.responseService.deletionSuccessful();
    else
      return this.responseService.deletionUnsuccessful();
  }
}
