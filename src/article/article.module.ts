import { Module } from '@nestjs/common';
import { ArticleService } from './services/article/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleController } from './controllers/article/article.controller';
import { AuthModule } from 'src/auth/auth.module';
import { NoteArticle } from './entities/noteArticle.entity';
import { Commentary } from './entities/commentary.entity';
import { CommentController } from './controllers/comment/comment.controller';
import { CommentService } from './services/comment/comment.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Article, NoteArticle, Commentary])
  ],
  providers: [ArticleService, CommentService],
  controllers: [ArticleController, CommentController]
})
export class ArticleModule { }
