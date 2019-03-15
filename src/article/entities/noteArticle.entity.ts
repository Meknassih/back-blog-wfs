import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Article } from './article.entity';

/**
 * Enum for article grades.
 * @readonly
 * @enum {number}
 */
export enum ArticleGrade {
  NOGRADE,
  ONESTAR,
  TWOSTARS,
  THREESTARS,
  FOURSTARS,
  FIVESTARS
}

@Entity()
export class NoteArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.notes)
  user: User;

  @ManyToOne(type => Article, article => article.notes)
  article: User;

  @Column({
    type: 'enum',
    enum: ArticleGrade,
    default: ArticleGrade.NOGRADE
  })
  status: ArticleGrade;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
