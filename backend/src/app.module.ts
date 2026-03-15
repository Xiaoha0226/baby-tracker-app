import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RecordsModule } from './records/records.module';
import { AiModule } from './ai/ai.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbPath = configService.get<string>('DATABASE_PATH', './data/baby-tracker.db');
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        return {
          type: 'sqljs',
          location: dbPath,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          autoLoadEntities: true,
          autoSave: true,
        };
      },
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    RecordsModule,
    AiModule,
    UsersModule,
  ],
})
export class AppModule {}
