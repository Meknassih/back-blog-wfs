import { Controller, Delete, Param } from '@nestjs/common';
import { CommentService } from 'src/article/services/comment/comment.service';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) { }
  @Delete(':id')
  async deleteComment(@Param('id') id: number): Promise<Boolean> {
    return (await this.commentService.delete(id)).raw.affectedRows >= 1;
  }
}
