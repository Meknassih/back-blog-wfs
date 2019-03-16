import { Controller, Get, HttpException, UseGuards, Delete, Body, Patch, UseInterceptors, FileInterceptor, UploadedFile, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ResponseService } from '../services/response.service';
import { User, UserType } from '../entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RoleGuard } from '../guards/role.guard';
import { UserDto } from 'src/models/user';
import { FileDto } from 'src/models/file-dto';

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
   * @returns {Promise<User>}
   */
  @Patch()
  async updateCurrentUser(@Body() userPart: Partial<UserDto>): Promise<User> {
    return await this.userService.updateCurrentUser(userPart);
  }

  /**
   * Updates the current user's avatar with the new picture
   * @function updateCurrentUserAvatar
   * @returns {Promise<User>}
   */
  @Patch('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateCurrentUserAvatar(@UploadedFile() { buffer }: FileDto): Promise<any> {
    return await this.userService.updateCurrentUserAvatar(buffer);
  }

  /**
   * Updates a user's email with the new data
   * @function updateUserEmail
   * @param {number} userId The target user's ID
   * @param {string} email The new email to be set
   * @returns {Promise<User>}
   */
  @Patch(':id/email')
  @Roles(UserType.ADMIN)
  async updateUserEmail(@Param('id') userId: number, @Body('email') email: string): Promise<User> {
    return await this.userService.updateEmail(userId, email);
  }

  /**
   * Disables a user's account
   * @function disableUser
   * @param {number} userId The target user's ID
   * @returns {Promise<User>}
   */
  @Patch(':id/disable')
  @Roles(UserType.ADMIN)
  async disableUser(@Param('id') userId: number): Promise<User> {
    return await this.userService.setDisabled(userId, true);
  }

  /**
   * Enables a user's account
   * @function enableUser
   * @param {number} userId The target user's ID
   * @returns {Promise<User>}
   */
  @Patch(':id/enable')
  @Roles(UserType.ADMIN)
  async enableUser(@Param('id') userId: number): Promise<User> {
    return await this.userService.setDisabled(userId, false);
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
