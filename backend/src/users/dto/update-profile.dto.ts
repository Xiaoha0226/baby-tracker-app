import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: '显示名称不能为空' })
  @MaxLength(50, { message: '显示名称不能超过 50 个字符' })
  nickname?: string;
}
