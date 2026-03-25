import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { BabyRecord, RecordType } from './record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(BabyRecord)
    private recordRepository: Repository<BabyRecord>,
  ) {}

  async create(userId: number, createRecordDto: CreateRecordDto): Promise<BabyRecord> {
    const record = this.recordRepository.create({
      userId,
      babyId: createRecordDto.babyId,
      type: createRecordDto.type as RecordType,
      recordTime: new Date(createRecordDto.recordTime),
      details: createRecordDto.details || {},
      note: createRecordDto.note,
    });
    return this.recordRepository.save(record);
  }

  async findAll(
    userId: number,
    babyId?: number,
    type?: string,
    date?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<BabyRecord[]> {
    const queryBuilder = this.recordRepository.createQueryBuilder('record')
      .where('record.userId = :userId', { userId });

    if (babyId) {
      queryBuilder.andWhere('record.babyId = :babyId', { babyId });
    }

    if (type) {
      queryBuilder.andWhere('record.type = :type', { type });
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('record.recordTime BETWEEN :start AND :end', { start, end });
    } else if (startDate && endDate) {
      queryBuilder.andWhere('record.recordTime BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    return queryBuilder.orderBy('record.recordTime', 'DESC').getMany();
  }

  async findOne(id: number, userId: number): Promise<BabyRecord> {
    const record = await this.recordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException('记录不存在');
    }
    if (record.userId !== userId) {
      throw new ForbiddenException('无权访问此记录');
    }
    return record;
  }

  async update(id: number, userId: number, updateRecordDto: UpdateRecordDto): Promise<BabyRecord> {
    const record = await this.findOne(id, userId);
    if (updateRecordDto.type) {
      record.type = updateRecordDto.type as RecordType;
    }
    if (updateRecordDto.recordTime) {
      record.recordTime = new Date(updateRecordDto.recordTime);
    }
    if (updateRecordDto.details) {
      record.details = updateRecordDto.details;
    }
    if (updateRecordDto.note !== undefined) {
      record.note = updateRecordDto.note;
    }
    return this.recordRepository.save(record);
  }

  async remove(id: number, userId: number): Promise<void> {
    const record = await this.findOne(id, userId);
    await this.recordRepository.remove(record);
  }

  async getTodaySummary(userId: number, babyId?: number): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const queryBuilder = this.recordRepository.createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .andWhere('record.recordTime BETWEEN :today AND :tomorrow', { today, tomorrow });

    if (babyId) {
      queryBuilder.andWhere('record.babyId = :babyId', { babyId });
    }

    const todayRecords = await queryBuilder.getMany();

    const yesterdayEveningStart = new Date(yesterday);
    yesterdayEveningStart.setHours(18, 0, 0, 0);
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const yesterdayQueryBuilder = this.recordRepository.createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .andWhere('record.recordTime BETWEEN :yesterdayEveningStart AND :todayStart', {
        yesterdayEveningStart,
        todayStart,
      })
      .andWhere('record.type = :type', { type: RecordType.SLEEP });

    if (babyId) {
      yesterdayQueryBuilder.andWhere('record.babyId = :babyId', { babyId });
    }

    const yesterdayEveningRecords = await yesterdayQueryBuilder.getMany();

    let totalMilk = 0;
    let diaperCount = 0;
    let poopCount = 0;
    let foodCount = 0;
    let sleepDuration = 0;

    for (const record of todayRecords) {
      switch (record.type) {
        case RecordType.FEEDING:
          totalMilk += record.details?.amount || 0;
          break;
        case RecordType.DIAPER:
          diaperCount++;
          break;
        case RecordType.POOP:
          poopCount++;
          break;
        case RecordType.FOOD:
          foodCount++;
          break;
        case RecordType.SLEEP:
          sleepDuration += record.details?.duration || 0;
          break;
      }
    }

    for (const record of yesterdayEveningRecords) {
      sleepDuration += record.details?.duration || 0;
    }

    return {
      totalMilk,
      diaperCount,
      poopCount,
      foodCount,
      sleepDuration,
    };
  }

  async getStats(userId: number, type: string, babyId?: number, days: number = 30): Promise<any[]> {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const queryBuilder = this.recordRepository.createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .andWhere('record.type = :type', { type: type as RecordType })
      .andWhere('record.recordTime BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (babyId) {
      queryBuilder.andWhere('record.babyId = :babyId', { babyId });
    }

    const records = await queryBuilder
      .orderBy('record.recordTime', 'ASC')
      .getMany();

    const statsMap = new Map<string, number>();

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      statsMap.set(dateStr, 0);
    }

    for (const record of records) {
      const dateStr = record.recordTime.toISOString().split('T')[0];
      if (type === RecordType.FEEDING) {
        statsMap.set(dateStr, (statsMap.get(dateStr) || 0) + (record.details?.amount || 0));
      } else if (type === RecordType.SLEEP) {
        statsMap.set(dateStr, (statsMap.get(dateStr) || 0) + (record.details?.duration || 0));
      } else {
        statsMap.set(dateStr, (statsMap.get(dateStr) || 0) + 1);
      }
    }

    const result: { date: string; value: number }[] = [];
    statsMap.forEach((value, date) => {
      result.push({ date, value });
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }
}
