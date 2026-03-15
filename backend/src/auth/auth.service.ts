import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.log(`Validating user: ${username}`);
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      this.logger.log(`User found: ${user ? user.username : 'not found'}`);
      
      if (!user) {
        this.logger.warn(`User not found: ${username}`);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      this.logger.log(`Password valid: ${isPasswordValid}`);
      
      if (isPasswordValid) {
        const { password: _, ...result } = user;
        return result;
      }
      
      this.logger.warn(`Invalid password for user: ${username}`);
      return null;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    const { username, password, nickname } = registerDto;
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new UnauthorizedException('用户名已存在');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      nickname: nickname || username,
    });
    await this.userRepository.save(user);
    const { password: _, ...result } = user;
    return {
      message: '注册成功',
      user: result,
    };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
      },
    };
  }
}
