import { Module } from '@nestjs/common';
import { ArticleService } from './services/article/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article])
  ],
  providers: [ArticleService]
})
export class ArticleModule { }
