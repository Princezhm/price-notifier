import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Timer extends BaseEntity {
  @PrimaryGeneratedColumn()
  //@ts-ignore: strictPropertyInitialization
  id: number;

  @Column()
  //@ts-ignore: strictPropertyInitialization
  notification_rate: number;
}
