import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserLoginDto } from 'src/models/user';

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
