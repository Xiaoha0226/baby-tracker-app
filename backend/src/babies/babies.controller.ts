import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BabiesService } from './babies.service';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: number;
  };
}

@Controller('babies')
@UseGuards(JwtAuthGuard)
export class BabiesController {
  constructor(private readonly babiesService: BabiesService) {}

  @Post()
  create(@Body() createBabyDto: CreateBabyDto, @Request() req: RequestWithUser) {
    return this.babiesService.create(req.user.userId, createBabyDto);
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.babiesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.babiesService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBabyDto: UpdateBabyDto, @Request() req: RequestWithUser) {
    return this.babiesService.update(+id, req.user.userId, updateBabyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.babiesService.remove(+id, req.user.userId);
  }

  @Post('default')
  createDefault(@Request() req: RequestWithUser) {
    return this.babiesService.createDefaultBaby(req.user.userId);
  }
}
