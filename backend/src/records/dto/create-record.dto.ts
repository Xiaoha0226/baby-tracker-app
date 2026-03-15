import { IsString, IsEnum, IsDateString, IsOptional, IsObject } from 'class-validator';
import { RecordType } from '../record.entity';

export class CreateRecordDto {
  @IsString()
  type: string;

  @IsDateString()
  recordTime: string;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;

  @IsString()
  @IsOptional()
  note?: string;
}
