import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Historic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column()
  notified!: boolean;

  @Column()
  provider!: string;

  @Column()
  price!: number;

  @Column()
  error!: string;
}
