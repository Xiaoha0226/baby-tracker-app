import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Baby } from './baby.entity';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';

@Injectable()
export class BabiesService {
  constructor(
    @InjectRepository(Baby)
    private readonly babyRepository: Repository<Baby>,
  ) {}

  async create(userId: number, createBabyDto: CreateBabyDto): Promise<Baby> {
    const baby = this.babyRepository.create({
      ...createBabyDto,
      userId,
      birthDate: new Date(createBabyDto.birthDate),
    });
    return this.babyRepository.save(baby);
  }

  async findAll(userId: number): Promise<Baby[]> {
    return this.babyRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Baby> {
    const baby = await this.babyRepository.findOne({
      where: { id },
    });

    if (!baby) {
      throw new NotFoundException(`Baby with ID ${id} not found`);
    }

    if (baby.userId !== userId) {
      throw new ForbiddenException('You do not have access to this baby');
    }

    return baby;
  }

  async update(id: number, userId: number, updateBabyDto: UpdateBabyDto): Promise<Baby> {
    const baby = await this.findOne(id, userId);
    
    const updateData: any = { ...updateBabyDto };
    if (updateBabyDto.birthDate) {
      updateData.birthDate = new Date(updateBabyDto.birthDate);
    }

    await this.babyRepository.update(id, updateData);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const baby = await this.findOne(id, userId);
    await this.babyRepository.remove(baby);
  }

  async createDefaultBaby(userId: number): Promise<Baby> {
    const existingBabies = await this.findAll(userId);
    if (existingBabies.length > 0) {
      return existingBabies[0];
    }

    const defaultBaby = this.babyRepository.create({
      userId,
      name: '宝宝',
      birthDate: new Date(),
      gender: 'unknown' as any,
    });
    return this.babyRepository.save(defaultBaby);
  }
}
