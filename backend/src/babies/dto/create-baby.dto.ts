import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { Gender } from '../baby.entity';

export class CreateBabyDto {
  @IsString()
  name: string;

  @IsDateString()
  birthDate: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  avatar?: string;
}
