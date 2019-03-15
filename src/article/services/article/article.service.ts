import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article, ArticleStatus } from 'src/article/entities/article.entity';
import { Repository, DeleteResult } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { NewArticleDto } from 'src/models/article';
import { UserService } from 'src/auth/services/user.service';

/**
 * Handles and manipulates all articles
 * @constructs ArticleService
 * @param {Repository<Article>} articleRepository The repository representing the articles in the DB
 */
@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
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
    const article = await this.articleRepository.findOne(id);
    return article;
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
}
