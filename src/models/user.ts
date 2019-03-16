import { ApiModelProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiModelProperty()
  readonly username: string;

  @ApiModelProperty()
  readonly password: string;

  @ApiModelProperty()
  readonly email: string;

  @ApiModelProperty()
  readonly firstname: string;

  @ApiModelProperty()
  readonly lastname: string;
}

export class UserLoginDto {
  @ApiModelProperty()
  readonly username: string;

  @ApiModelProperty()
  readonly password: string;
}
