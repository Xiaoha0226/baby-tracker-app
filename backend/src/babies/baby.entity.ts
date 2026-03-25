import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { BabyRecord } from '../records/record.entity';

export enum Gender {
  BOY = 'boy',
  GIRL = 'girl',
  UNKNOWN = 'unknown',
}

@Entity('babies')
export class Baby {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({
    type: 'varchar',
    enum: Gender,
    default: Gender.UNKNOWN,
    nullable: true,
  })
  gender: Gender;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => BabyRecord, record => record.baby)
  records: BabyRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
