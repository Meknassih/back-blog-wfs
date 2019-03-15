import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Article } from './article.entity';

@Entity()
export class Commentary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.comments)
  user: User;

  @ManyToOne(type => Article, article => article.comments)
  article: Article;

  @Column('varchar')
  content: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
