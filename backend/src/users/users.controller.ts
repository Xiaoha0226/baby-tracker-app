import { Controller, Get, Patch, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.userId, updateProfileDto.nickname!);
    const { password, ...result } = user;
    return {
      code: 0,
      message: '资料更新成功',
      data: result,
    };
  }

  @Post('change-password')
  async changePassword(@Request() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    await this.usersService.changePassword(
      req.user.userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
      changePasswordDto.confirmPassword,
    );
    return {
      code: 0,
      message: '密码修改成功',
    };
  }
}
