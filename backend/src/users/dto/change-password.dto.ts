import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6, { message: '新密码至少需要 6 个字符' })
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
