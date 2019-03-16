import { ApiModelProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiModelProperty()
  fieldname: string;

  @ApiModelProperty()
  originalname: string;

  @ApiModelProperty()
  encoding: string;

  @ApiModelProperty()
  mimetype: string;

  @ApiModelProperty()
  buffer: Buffer;

  @ApiModelProperty()
  size: number;
}
