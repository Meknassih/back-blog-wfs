import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserLoginDto, UserDto } from 'src/models/user';

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
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  /**
   * Resolves with User or undefined
   * @async
   * @function loginUser
   * @param  {UserLoginDto} user The user to verify credentials for
   * @returns {Promise<(User|undefined)>}
   */
  async loginUser(user: UserLoginDto): Promise<User | undefined> {
    const userFound = await this.userRepository.find(
      {
        where: user
      });
    if (userFound[0])
      this.currentUser = userFound[0];

    return this.currentUser;
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
   * @returns {Promise<User[]>}
   */
  async all(): Promise<User[]> {
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
   * @returns {Promise<User>}
   */
  async setDisabled(userId: number, disable: boolean): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    user.disabled = disable;
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
}
