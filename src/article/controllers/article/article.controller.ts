import { Controller, Get, HttpException, Post, Body, UseGuards, Delete, Param, Patch, Put } from '@nestjs/common';
import { Article } from 'src/article/entities/article.entity';
import { UserType } from 'src/auth/entities/user.entity';
import { ArticleService } from 'src/article/services/article/article.service';
import { NewArticleDto } from 'src/models/article';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { NoteArticleDto } from 'src/models/noteArticle';
import { UserService } from 'src/auth/services/user.service';

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
    private readonly userService: UserService
  ) { }

  @Get()
  async getAll(): Promise<Article[] | HttpException> {
    return await this.articleService.getAll();
  }

  @Get('listmine')
  async getAllMine(): Promise<Article[] | HttpException> {
    return await this.articleService.getAll(this.userService.getCurrentUser());
  }

  @Get(':id')
  async getOne(@Param('id') articleId: number): Promise<Article | HttpException> {
    return await this.articleService.get(articleId);
  }

  @Post()
  @Roles(UserType.AUTHOR)
  async createArticle(@Body() article: NewArticleDto): Promise<Article | HttpException> {
    return await this.articleService.createArticle(article);
  }

  @Delete(':id')
  @Roles(UserType.AUTHOR)
  async deleteArticle(@Param('id') articleId: number): Promise<boolean> {
    return (await this.articleService.delete(articleId)).raw.affectedRows >= 1;
  }

  @Patch(':id')
  @Roles(UserType.AUTHOR)
  async editArticle(@Param('id') articleId: number, @Body() articlePart: Partial<NewArticleDto>): Promise<boolean> {
    return (await this.articleService.updateArticle(articleId, articlePart)).raw.affectedRows >= 1;
  }

  @Patch(':id/hide')
  @Roles(UserType.ADMIN)
  async hideArticle(@Param('id') articleId: number): Promise<Article> {
    return await this.articleService.setHidden(articleId, true);
  }

  @Patch(':id/unhide')
  @Roles(UserType.ADMIN)
  async unhideArticle(@Param('id') articleId: number): Promise<Article> {
    return await this.articleService.setHidden(articleId, false);
  }

  @Post(':id')
  async gradeArticle(@Param('id') articleId: number, @Body() noteArticle: NoteArticleDto): Promise<Article> {
    return await this.articleService.gradeArticle(articleId, noteArticle);
  }
}
