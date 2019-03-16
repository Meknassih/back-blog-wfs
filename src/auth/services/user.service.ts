import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User, UserType } from '../entities/user.entity';
import { UserLoginDto, UserDto } from 'src/models/user';
import { ResponseService } from './response.service';

/**
 * Handles and manipulates all user data
 * @constructs UserService
 * @param {Repository<User>} userRepository The repository representing the users in the DB
 */
@Injectable()
export class UserService {
  /** @member {User} currentUser The user currently logged in or undefined if visitor */
  private currentUser: User;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly responseService: ResponseService
  ) { }

  /**
   * Resolves with User
   * @async
   * @function loginUser
   * @param  {UserLoginDto} user The user to verify credentials for
   * @returns {Promise<(User | HttpException)>}
   */
  async loginUser(user: UserLoginDto): Promise<User | HttpException> {
    const userFound = await this.userRepository.find(
      {
        where: user
      });
    if (userFound[0]) {
      if (userFound[0].disabled)
        return this.responseService.userAccountDisabled();
      else
        return this.currentUser = userFound[0];
    } else
      return this.responseService.badLogin();
  }

  /**
   * Resolves with the new User
   * @async
   * @function signupUser
   * @param  {UserDto} user The user to sign up
   * @returns {Promise<(User | HttpException)>}
   */
  async signupUser(userDto: UserDto): Promise<User | HttpException> {
    const user = new User();
    if (!userDto.username || !(/\b[a-zA-Z0-9]{4,}/.test(userDto.username)))
      this.responseService.invalidSignup('username');
    else if (!userDto.password || !(/\b[a-zA-Z0-9]{4,}/.test(userDto.password)))
      this.responseService.invalidSignup('password');
    else if (!userDto.firstname || !(/\b[a-zA-Z]{1,}/.test(userDto.firstname)))
      this.responseService.invalidSignup('firstname');
    else if (!userDto.lastname || !(/\b[a-zA-Z]{1,}/.test(userDto.lastname)))
      this.responseService.invalidSignup('lastname');
    else if (!userDto.email || !(/\w+@\w+\.[a-zA-Z]+/.test(userDto.email)))
      this.responseService.invalidSignup('email');
    else {
      Object.getOwnPropertyNames(userDto).forEach(prop => {
        user[prop] = userDto[prop];
      });
      user.avatar = new Buffer('');
      return await this.userRepository.save(user);
    }
  }

  /**
   * Refreshes the current User in memory from the DB
   * @async
   * @function refreshCurrentUser
   * @returns {Promise<void>}
   */
  async refreshCurrentUser(): Promise<void> {
    this.currentUser = await this.userRepository.findOne(this.currentUser.id);
  }

  /**
   * Returns the data of the current user or undefined
   * @function getCurrentUser
   * @returns {(User|undefined)}
   */
  getCurrentUser(): User | undefined { return this.currentUser; }

  /**
   * Resolves with an array of Users
   * @async
   * @function all
   * @param {boolean} sortByRole Users are sorted from most privileges to lowest if true
   * @returns {Promise<User[]>}
   */
  async all(sortByRole?: boolean): Promise<User[]> {
    if (sortByRole)
      return await this.userRepository.find({ order: { type: 'DESC' } });
    else
      return await this.userRepository.find();
  }

  /**
   * Updates the attributes of a User and resolves with the new instance
   * @async
   * @function updateCurrentUser
   * @param {Partial<UserDto>} userPart Attributes of user to be updated
   * @returns {Promise<User>}
   */
  async updateCurrentUser(userPart: Partial<UserDto>): Promise<User> {
    const user = this.getCurrentUser();
    Object.getOwnPropertyNames(userPart).forEach(prop => {
      user[prop] = userPart[prop];
    });
    return this.currentUser = await this.userRepository.save(user);
  }

  /**
   * Updates the avatar of a User and resolves with the new instance
   * @async
   * @function updateCurrentUserAvatar
   * @param {Buffer} avatar New avatar to be updated
   * @returns {Promise<User>}
   */
  async updateCurrentUserAvatar(avatar: Buffer): Promise<User> {
    const user = this.getCurrentUser();
    // console.log(avatar);
    user.avatar = avatar;
    return this.currentUser = await this.userRepository.save(user);
  }

  /**
   * Updates the email of a User and resolves with the new instance
   * @async
   * @function updateEmail
   * @param {number} userId The target user's ID
   * @param {string} email The new email to be set
   * @returns {Promise<User>}
   */
  async updateEmail(userId: number, email: string): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    user.email = email;
    return await this.userRepository.save(user);
  }

  /**
   * Updates the email of a User and resolves with the new instance
   * @async
   * @function setDisabled
   * @param {number} userId The target user's ID
   * @param {boolean} disable Disables/enables the user account when true/false
   * @returns {Promise<User | HttpException>}
   */
  async setDisabled(userId: number, disable: boolean): Promise<User | HttpException> {
    const user = await this.userRepository.findOne(userId);
    if (user.type === UserType.ADMIN && !this.isSelf(user))
      return this.responseService.protectedUser();

    user.disabled = disable;
    return await this.userRepository.save(user);
  }

  /**
   * Updates the role of a User and resolves with the new instance
   * @async
   * @function updateRole
   * @param {number} userId The target user's ID
   * @param {UserType} role The new role to be set
   * @returns {Promise<(User | HttpException)>}
   */
  async updateRole(userId: number, role: UserType): Promise<User | HttpException> {
    const user = await this.userRepository.findOne(userId);
    if (user.type === UserType.ADMIN && !this.isSelf(user))
      return this.responseService.protectedUser();

    user.type = role;
    return await this.userRepository.save(user);
  }

  /**
   * Resolves with the result of a user permanent deletion
   * @async
   * @function delete
   * @param {string} username The username of the user to be deleted
   * @returns {Promise<DeleteResult>}
   */
  async delete(username: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ username });
  }

  /**
   * Returns if User is the currently logged user
   * @param {User} user The User to test
   * @returns {boolean}
   */
  private isSelf(user: User): boolean {
    return user.id === this.getCurrentUser().id;
  }
}
