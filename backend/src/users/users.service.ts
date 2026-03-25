import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateProfile(userId: number, nickname: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    user.nickname = nickname;
    await this.userRepository.save(user);

    return user;
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('两次输入的密码不一致');
    }

    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('当前密码错误');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }
}
