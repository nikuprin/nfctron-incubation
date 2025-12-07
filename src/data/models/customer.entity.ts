import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.interface';

@Entity('customers')
export class CustomerEntity implements Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;
}
