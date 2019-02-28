import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article, ArticleStatus } from 'src/article/entities/article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

/**
 * Handles and manipulates all articles
 * @constructs ArticleService
 * @param {Repository<Article>} articleRepository The repository representing the articles in the DB
 */
@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>
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
}
