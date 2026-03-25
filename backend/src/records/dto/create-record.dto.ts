import { IsString, IsEnum, IsDateString, IsOptional, IsObject, IsNumber } from 'class-validator';
import { RecordType } from '../record.entity';

export class CreateRecordDto {
  @IsNumber()
  babyId: number;

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
