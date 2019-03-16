import { Injectable, HttpException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Commentary } from 'src/article/entities/commentary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/auth/services/user.service';
import { CommentaryDto } from 'src/models/commentary';
import { ArticleService } from '../article/article.service';
import { ResponseService } from 'src/auth/services/response.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Commentary) private readonly commentRepository: Repository<Commentary>,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
    private readonly responseService: ResponseService
  ) { }

  /**
   * Resolves with the Comment that has the given ID
   * @async
   * @function get
   * @param {number} id The ID of the comment to be fetched
   * @returns {Promise<Commentary>}
   */
  async get(id: number, relations?: boolean): Promise<Commentary> {
    if (relations)
      return await this.commentRepository.findOne(id, { relations: ['user', 'article'] });
    else
      return await this.commentRepository.findOne(id);
  }

  /**
   * Resolves with the result of the deletion of a Commentary with the given ID
   * @async
   * @function delete
   * @param {number} id The ID of the article to be fetched
   * @returns {Promise<DeleteResult>}
   */
  async delete(id: number): Promise<DeleteResult> {
    return await this.commentRepository.delete({ id, user: this.userService.getCurrentUser() });
  }

  /**
   * Adds a reply to a comment and resolves with the newly created comment
   * @async
   * @function reply
   * @param {number} parentId The ID of the parent comment
   * @param {CommentaryDto} commentDto Commentary to be added in reply
   * @returns {Promise<Commentary>}
   */
  async reply(parentId: number, commentDto: CommentaryDto): Promise<Commentary> {
    const parent = await this.get(parentId, true);
    if (!parent)
      return undefined;
    const comment = new Commentary();
    comment.user = this.userService.getCurrentUser();
    comment.article = parent.article;
    comment.parent = parent;
    comment.content = commentDto.content;
    return await this.commentRepository.save(comment);
  }

  /**
   * Adds a comment to an article and resolves with the comment
   * @async
   * @function addComment
   * @param {number} articleId The ID of the article
   * @param {CommentaryDto} commentDto Commentary to be added to an Article with the given ID
   * @returns {Promise<Commentary | HttpException>}
   */
  async addComment(articleId: number, commentDto: CommentaryDto): Promise<Commentary | HttpException> {
    const comment = new Commentary();
    comment.user = this.userService.getCurrentUser();
    comment.article = await this.articleService.get(articleId);
    if (!comment.article)
      return this.responseService.noSuchArticle();
    comment.content = commentDto.content;
    const result = await this.commentRepository.save(comment);
    return result;
  }
}
