import { Controller, Get, HttpException, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from 'src/auth/services/user.service';
import { ResponseService } from 'src/auth/services/response.service';
import { Article } from 'src/article/entities/article.entity';
import { UserType } from 'src/auth/entities/user.entity';
import { ArticleService } from 'src/article/services/article/article.service';
import { NewArticleDto } from 'src/models/article';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

/**
 * Handles article operations
 * @constructs ArticleController
 * @param {UserService} userService
 * @param {ResponseService} responseService
 */
@Controller('article')
@UseGuards(AuthGuard, RoleGuard)
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

  @Post()
  @Roles(UserType.AUTHOR)
  async createArticle(@Body() article: NewArticleDto): Promise<Article | HttpException> {
    return this.articleService.createArticle(article);
  }
}
