import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Provider extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  status!: boolean;

  @Column()
  endpoint!: string;

  @Column()
  value_route!: string;

  @Column()
  open!: boolean;

  @Column()
  slider_min!: number;

  @Column()
  slider_max!: number;

  @Column()
  step!: number;

  @Column()
  value_to_notify!: number;
}
