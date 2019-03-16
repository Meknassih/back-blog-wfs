export interface UserDto {
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
}

export class UserLoginDto {
  readonly username: string;
  readonly password: string;

  constructor(attributes: UserAttributes) {
    this.username = attributes.username;
    this.password = attributes.password;
  }
}

export interface UserAttributes {
  username?: string;
  password?: string;
  email?: string;
}
