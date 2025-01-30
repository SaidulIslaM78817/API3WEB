import { AdminEntity } from 'src/admin/admin.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  pid: number;

  @Column()
  productType: string;

  @Column({ nullable: true })
  photoFileName: string;

  @ManyToOne(() => AdminEntity, (Admin) => Admin.Products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'AdminID' })
  Admin: AdminEntity;
}
