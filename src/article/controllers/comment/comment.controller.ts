import { Controller, Delete, Param, UseGuards, Post, Put, Body, HttpException } from '@nestjs/common';
import { CommentService } from 'src/article/services/comment/comment.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'src/auth/entities/user.entity';
import { CommentaryDto } from 'src/models/commentary';
import { Commentary } from 'src/article/entities/commentary.entity';
import { ApiUseTags, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';

/**
 * Handles comment operations
 * @constructs CommentController
 * @param {CommentService} commentService
 */
@ApiUseTags('comment')
@ApiResponse({ status: 401, description: 'Cette requête nécessite d\'être connecté au préalable.' })
@Controller('comment')
@UseGuards(AuthGuard, RoleGuard)
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) { }

  @Delete(':id')
  async deleteComment(@Param('id') id: number): Promise<boolean> {
    return (await this.commentService.delete(id)).raw.affectedRows >= 1;
  }

  @ApiBadRequestResponse({ description: 'L\'article ciblé n\'existe pas.' })
  @Put('article/:id')
  async commentArticle(@Param('id') articleId: number, @Body() comment: CommentaryDto): Promise<Commentary | HttpException> {
    return await this.commentService.addComment(articleId, comment);
  }

  @ApiResponse({ status: 401, description: 'Cette requête nécessite des droits plus élevés.' })
  @Put('reply/:id')
  @Roles(UserType.AUTHOR)
  async replyToComment(@Param('id') parentId: number, @Body() comment: CommentaryDto): Promise<Commentary> {
    return await this.commentService.reply(parentId, comment);
  }
}
