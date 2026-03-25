import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Baby } from '../babies/baby.entity';

export enum RecordType {
  FEEDING = 'feeding',
  DIAPER = 'diaper',
  POOP = 'poop',
  FOOD = 'food',
  SLEEP = 'sleep',
  OTHER = 'other',
}

@Entity('records')
export class BabyRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  babyId: number;

  @ManyToOne(() => Baby, baby => baby.records)
  @JoinColumn({ name: 'babyId' })
  baby: Baby;

  @Column({
    type: 'varchar',
    enum: RecordType,
    default: RecordType.OTHER,
  })
  type: RecordType;

  @Column({ type: 'datetime' })
  recordTime: Date;

  @Column({ type: 'json', nullable: true })
  details: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
