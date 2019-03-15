import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Commentary } from 'src/article/entities/commentary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/auth/services/user.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Commentary) private readonly commentRepository: Repository<Commentary>,
    private readonly userService: UserService
  ) { }

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
}
