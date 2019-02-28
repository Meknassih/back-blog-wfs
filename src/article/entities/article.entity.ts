import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

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

  @Column('varchar')
  author: User;

  @Column('varchar')
  content: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT
  })
  status: ArticleStatus;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
