import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(8)
  @Exclude()
  password: string;
}
