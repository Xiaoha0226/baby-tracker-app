import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Controller('records')
@UseGuards(JwtAuthGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  create(@Body() createRecordDto: CreateRecordDto, @Request() req: any) {
    return this.recordsService.create(req.user.userId, createRecordDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('type') type?: string,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.recordsService.findAll(req.user.userId, type, date, startDate, endDate);
  }

  @Get('today-summary')
  getTodaySummary(@Request() req: any) {
    return this.recordsService.getTodaySummary(req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req: any, @Query('type') type: string, @Query('days') days?: string) {
    return this.recordsService.getStats(req.user.userId, type, days ? parseInt(days) : 30);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.recordsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecordDto: UpdateRecordDto,
    @Request() req: any,
  ) {
    return this.recordsService.update(id, req.user.userId, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.recordsService.remove(id, req.user.userId);
  }
}
