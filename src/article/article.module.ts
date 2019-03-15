import { Module } from '@nestjs/common';
import { ArticleService } from './services/article/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleController } from './controllers/article/article.controller';
import { UserService } from 'src/auth/services/user.service';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { NoteArticle } from './entities/noteArticle.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Article, NoteArticle])
  ],
  providers: [ArticleService],
  controllers: [ArticleController]
})
export class ArticleModule { }
