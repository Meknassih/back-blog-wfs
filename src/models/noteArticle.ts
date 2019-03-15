import { ArticleGrade } from 'src/article/entities/noteArticle.entity';

export interface NoteArticleDto {
  readonly grade: ArticleGrade;
}