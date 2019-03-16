import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { NoteArticle } from 'src/article/entities/noteArticle.entity';
import { Commentary } from 'src/article/entities/commentary.entity';

/**
 * Enum for user types. Higher values gives more permissions.
 * @readonly
 * @enum {number}
 */

export enum UserType {
  STANDARD = 0,
  AUTHOR = 1,
  ADMIN = 9
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  username: string;

  @Column('varchar', { select: false })
  password: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  firstname: string;

  @Column('varchar')
  lastname: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.STANDARD
  })
  type: UserType;

  @OneToMany(type => Article, article => article.author)
  articles: Article[];

  @OneToMany(type => NoteArticle, note => note.user)
  notes: NoteArticle[];

  @OneToMany(type => Commentary, comment => comment.user)
  comments: Commentary[];

  @Column('blob')
  avatar: Buffer;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
