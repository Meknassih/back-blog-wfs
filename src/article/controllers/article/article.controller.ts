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
import { ApiUseTags, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ResponseService } from 'src/auth/services/response.service';

/**
 * Handles article operations
 * @constructs ArticleController
 * @param {UserService} userService
 * @param {ResponseService} responseService
 */
@ApiUseTags('article')
@ApiResponse({ status: 401, description: 'Cette requête nécessite d\'être connecté au préalable.' })
@Controller('article')
@UseGuards(AuthGuard, RoleGuard)
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly responseService: ResponseService
  ) { }

  @Get()
  async getAll(): Promise<Article[]> {
    return await this.articleService.getAll();
  }

  @ApiResponse({ status: 401, description: 'Cette requête nécessite des droits plus élevés.' })
  @Get('hidden')
  async getAllHidden(): Promise<Article[] | HttpException> {
    if (this.userService.getCurrentUser().type === UserType.ADMIN)
      return await this.articleService.getAll({ hiddenOnly: true });
    else if (this.userService.getCurrentUser().type === UserType.AUTHOR)
      return await this.articleService.getAll({
        hiddenOnly: true,
        ownedByUser: this.userService.getCurrentUser()
      });
    else
      return this.responseService.unsufficientPrivileges();
  }

  @Get('mine')
  async getAllMine(): Promise<Article[]> {
    return await this.articleService.getAll({ ownedByUser: this.userService.getCurrentUser() });
  }

  @ApiBadRequestResponse({ description: 'L\'article ciblé n\'existe pas.' })
  @Get(':id')
  async getOne(@Param('id') articleId: number): Promise<Article | HttpException> {
    const article = await this.articleService.get(articleId);
    return article ? article : this.responseService.noSuchArticle();
  }

  @ApiResponse({ status: 401, description: 'Cette requête nécessite des droits plus élevés.' })
  @Post()
  @Roles(UserType.AUTHOR)
  async createArticle(@Body() article: NewArticleDto): Promise<Article | HttpException> {
    return await this.articleService.createArticle(article);
  }

  @ApiBadRequestResponse({ description: 'L\'article ciblé n\'existe pas.' })
  @ApiResponse({ status: 401, description: 'Cette requête nécessite des droits plus élevés.' })
  @ApiResponse({ status: 200, description: 'Suppression effectuée avec succès.' })
  @Delete(':id')
  @Roles(UserType.AUTHOR)
  async deleteArticle(@Param('id') articleId: number): Promise<void | HttpException> {
    const result = await this.articleService.delete(articleId);
    if (result.raw.affectedRows >= 1)
      return this.responseService.deletionSuccessful();
    else
      return this.responseService.noSuchArticle();
  }

  @ApiBadRequestResponse({ description: 'L\'article ciblé n\'existe pas.' })
  @ApiResponse({ status: 401, description: 'Cette requête nécessite des droits plus élevés.' })
  @Patch(':id')
  @Roles(UserType.AUTHOR)
  async editArticle(@Param('id') articleId: number, @Body() articlePart: Partial<NewArticleDto>): Promise<Article | HttpException> {
    const result = await this.articleService.updateArticle(articleId, articlePart);
    if (result.raw.affectedRows >= 1)
      return this.articleService.get(articleId);
    else
      return this.responseService.noSuchArticle();
  }

  @ApiBadRequestResponse({ description: 'L\'article ciblé n\'existe pas.' })
  @ApiResponse({ status: 401, description: 'Cette requête nécessite des droits plus élevés.' })
  @Patch(':id/hide')
  @Roles(UserType.ADMIN)
  async hideArticle(@Param('id') articleId: number): Promise<Article | HttpException> {
    return await this.articleService.setHidden(articleId, true);
  }

  @ApiBadRequestResponse({ description: 'L\'article ciblé n\'existe pas.' })
  @ApiResponse({ status: 401, description: 'Cette requête nécessite des droits plus élevés.' })
  @Patch(':id/unhide')
  @Roles(UserType.ADMIN)
  async unhideArticle(@Param('id') articleId: number): Promise<Article | HttpException> {
    return await this.articleService.setHidden(articleId, false);
  }

  @ApiBadRequestResponse({ description: 'L\'article ciblé n\'existe pas.' })
  @Post(':id')
  async gradeArticle(@Param('id') articleId: number, @Body() noteArticle: NoteArticleDto): Promise<Article | HttpException> {
    return await this.articleService.gradeArticle(articleId, noteArticle);
  }
}
