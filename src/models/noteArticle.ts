import { ArticleGrade } from 'src/article/entities/noteArticle.entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class NoteArticleDto {
  @ApiModelProperty({ enum: [0, 1, 2, 3, 4, 5] })
  readonly grade: ArticleGrade;
}
