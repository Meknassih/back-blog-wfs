import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
