import { Module } from '@nestjs/common';
import { ArticleService } from './services/article/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleController } from './controllers/article/article.controller';
import { AuthModule } from 'src/auth/auth.module';
import { NoteArticle } from './entities/noteArticle.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Article, NoteArticle, Comment])
  ],
  providers: [ArticleService],
  controllers: [ArticleController]
})
export class ArticleModule { }
