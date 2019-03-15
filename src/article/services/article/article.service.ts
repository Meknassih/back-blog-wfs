import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article, ArticleStatus } from 'src/article/entities/article.entity';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { NewArticleDto } from 'src/models/article';
import { UserService } from 'src/auth/services/user.service';
import { NoteArticleDto } from 'src/models/noteArticle';
import { NoteArticle } from 'src/article/entities/noteArticle.entity';
import { Commentary } from 'src/article/entities/commentary.entity';
import { CommentaryDto } from 'src/models/commentary';

/**
 * Handles and manipulates all articles
 * @constructs ArticleService
 * @param {Repository<Article>} articleRepository The repository representing the articles in the DB
 */
@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(NoteArticle) private readonly noteRepository: Repository<NoteArticle>,
    @InjectRepository(Commentary) private readonly commentRepository: Repository<Commentary>,
    private readonly userService: UserService
  ) { }

  /**
   * Resolves with the Article that has the given ID
   * @async
   * @function get
   * @param {number} id The ID of the article to be fetched
   * @returns {Promise<Article>}
   */
  async get(id: number): Promise<Article> {
    return await this.articleRepository.findOne(id);
  }

  /**
   * Resolves with the result of the deletion of an Article with the given ID
   * @async
   * @function delete
   * @param {number} id The ID of the article to be fetched
   * @returns {Promise<DeleteResult>}
   */
  async delete(id: number): Promise<DeleteResult> {
    return await this.articleRepository.delete(id);
  }

  /**
   * Resolves with the result of the newly created Article
   * @async
   * @function set
   * @param {Article} article The article to be added
   * @returns {Promise<Article>}
   */
  async set(article: Article): Promise<Article>;
  /**
   * Resolves with the result of the newly created Article
   * @async
   * @function set
   * @param {string} title The article's title
   * @param {User} author The article's author
   * @param {string} content The article's body
   * @param {ArticleStatus} [status=ArticleStatus.DRAFT] The article's status
   * @returns {Promise<Article>}
   */
  async set(title: string, author: User, content: string, status?: ArticleStatus): Promise<Article>;
  async set(articleOrTitle: string | Article, author?: User, content?: string, status?: ArticleStatus): Promise<Article> {
    let result;

    if (articleOrTitle instanceof Article)
      result = await this.articleRepository.save(articleOrTitle);
    else {
      const newArticle = this.articleRepository.create({
        title: articleOrTitle,
        author,
        content,
        status
      });
      result = await this.articleRepository.save(newArticle);
    }

    return result;
  }

  /**
   * Resolves with all the Articles
   * @async
   * @function getAll
   * @param {id} ownedByUserId Specify a user ID to restrict to articles owned only by a user
   * @returns {Promise<Article[]>}
   */
  async getAll(ownedByUserId?: number): Promise<Article[]> {
    let articles: Article[];
    if (ownedByUserId)
      articles = await this.articleRepository.find({ where: { id: ownedByUserId } });
    else
      articles = await this.articleRepository.find();
    return articles;
  }

  /**
   * Saves an article and resolves with the newly created article
   * @async
   * @function createArticle
   * @param {NewArticleDto} articleDto Article as received in the request to be created in the DB
   * @returns {Promise<Article>}
   */
  async createArticle(articleDto: NewArticleDto): Promise<Article> {
    const article = new Article();
    article.author = this.userService.getCurrentUser();
    article.title = articleDto.title ? articleDto.title : '';
    article.content = articleDto.content ? articleDto.content : '';
    article.dislikes = 0;
    article.likes = 0;
    article.picture = new Buffer('IMAGE');
    return await this.articleRepository.save(article);
  }

  /**
   * Updates an article and resolves with true if changes were made
   * @async
   * @function updateArticle
   * @param {number} articleId The ID of the article
   * @param {Partial<NewArticleDto>} articleDto Part of an Article to be updated in the DB
   * @returns {Promise<Article>}
   */
  async updateArticle(articleId: number, articleDto: Partial<NewArticleDto>): Promise<UpdateResult> {
    return await this.articleRepository.update(articleId, articleDto);
  }
  /**
   * Adds a grade or updates an article's grades and resolves with the article
   * @async
   * @function gradeArticle
   * @param {number} articleId The ID of the article
   * @param {NoteArticleDto} noteArticleDto Grade to be applied to an Article with the given ID
   * @returns {Promise<Article>}
   */
  async gradeArticle(articleId: number, noteArticleDto: Partial<NoteArticleDto>): Promise<Article> {
    const article = await this.get(articleId);
    for (const note of article.notes) {
      if (note.user.id === this.userService.getCurrentUser().id) {
        // Updating exisiting grade
        note.grade = noteArticleDto.grade;
        await this.noteRepository.save(note);
        return article;
      }
    }
    // Adding new grade
    const newNote = new NoteArticle();
    newNote.article = article;
    newNote.user = this.userService.getCurrentUser();
    newNote.grade = noteArticleDto.grade;
    await this.noteRepository.save(newNote);
    return await this.get(article.id);
  }

  /**
   * Adds a comment to an article and resolves with the article
   * @async
   * @function commentOnArticle
   * @param {number} articleId The ID of the article
   * @param {CommentaryDto} commentDto Commentary to be added to an Article with the given ID
   * @returns {Promise<Article>}
   */
  async commentOnArticle(articleId: number, commentDto: CommentaryDto): Promise<Commentary> {
    const comment = new Commentary();
    comment.user = this.userService.getCurrentUser();
    comment.article = await this.get(articleId);
    comment.content = commentDto.content;
    const result = await this.commentRepository.save(comment);
    return result;
  }
}
