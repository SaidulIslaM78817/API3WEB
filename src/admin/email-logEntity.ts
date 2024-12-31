
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';


@Entity('email')
export class EmailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderUsername: string;

  @Column()
  receiver: string;

  @Column()
  subject: string;

  @Column()
  message: string;


  @CreateDateColumn()
  sentAt: Date;

}
