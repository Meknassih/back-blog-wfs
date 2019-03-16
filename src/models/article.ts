import { ApiModelProperty } from '@nestjs/swagger';

export class NewArticleDto {
  @ApiModelProperty()
  readonly title: string;

  @ApiModelProperty()
  readonly content: string;

  @ApiModelProperty()
  readonly picture: Buffer;
}
