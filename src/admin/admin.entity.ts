import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailEntity } from './email-log.entity';
import { ProductEntity } from 'src/product/product.entity';

@Entity('admin')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 80, unique: true })
  username: string;

  @Column({ unique: true })
  email: string;
  @Column()
  password: string;

  @Column({ nullable: true })
  photoFileName: string;

  @OneToMany(() => ProductEntity, (Product) => Product.Admin, {
    cascade: ['remove'],
  })
  Products: ProductEntity[];
}
