import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { NoteArticle } from 'src/article/entities/noteArticle.entity';

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

  @Column('varchar')
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

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
