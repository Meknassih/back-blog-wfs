import { Controller, Get, HttpException } from '@nestjs/common';
import { UserService } from 'src/auth/services/user.service';
import { ResponseService } from 'src/auth/services/response.service';
import { Article } from 'src/article/entities/article.entity';
import { UserType } from 'src/auth/entities/user.entity';
import { ArticleService } from 'src/article/services/article/article.service';

/**
 * Handles article operations
 * @constructs ArticleController
 * @param {UserService} userService
 * @param {ResponseService} responseService
 */
@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly responseService: ResponseService
  ) { }

  @Get()
  async getAll(): Promise<Article[] | HttpException> {
    return this.articleService.getAll();
  }
}
