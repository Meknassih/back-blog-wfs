import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserLoginDto } from 'src/models/user';

@Injectable()
export class UserService {
  private currentUser: User;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  async loginUser(user: UserLoginDto): Promise<User> {
    const userFound = await this.userRepository.find(
      {
        where: user
      });
    if (userFound[0])
      this.currentUser = userFound[0];

    return this.currentUser;
  }

  async all(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
