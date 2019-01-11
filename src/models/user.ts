import { MongooseDocument } from 'mongoose';

export class User {
  username: string;
  password: string;
  email: string;
}

export class UserDto {
  readonly username: string;
  readonly password: string;
  readonly email: string;

  constructor(attributes: UserAttributes) {
    this.username = attributes.username;
    this.password = attributes.password;
    this.email = attributes.email;
  }
}

export class UserLoginDto {
  readonly username: string;
  readonly password: string;
}

export interface UserAttributes {
  username?: string;
  password?: string;
  email?: string;
}
