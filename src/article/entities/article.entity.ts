import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { NoteArticle } from './noteArticle.entity';
import { Commentary } from './commentary.entity';

/**
 * Enum for article status. DRAFT means it has just been created,
 * UNPUBLISHED means it is being reviewed by moderators.
 * @readonly
 * @enum {number}
 */
export enum ArticleStatus {
  DRAFT,
  UNPUBLISHED,
  PUBLISHED
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @ManyToOne(type => User, user => user.articles, {
    eager: true
  })
  author: User;

  @OneToMany(type => NoteArticle, note => note.article, {
    eager: true
  })
  notes: NoteArticle[];

  @OneToMany(type => Commentary, comment => comment.article, {
    eager: true
  })
  comments: Commentary[];

  @Column('varchar')
  content: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT
  })
  status: ArticleStatus;

  @Column('int')
  likes: number;

  @Column('int')
  dislikes: number;

  @Column('mediumblob')
  picture: Buffer;

  @Column({
    type: 'boolean',
    default: false
  })
  hidden: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
