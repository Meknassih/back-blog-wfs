import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserAttributes } from 'src/models/user';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) { }

  async findOneWithAttributes(fields: UserAttributes): Promise<User> {
    return this.UserModel.find(fields).exec();
  }
}
