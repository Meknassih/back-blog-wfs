import { ApiModelProperty } from '@nestjs/swagger';

export class CommentaryDto {
  @ApiModelProperty()
  readonly content: string;
}
