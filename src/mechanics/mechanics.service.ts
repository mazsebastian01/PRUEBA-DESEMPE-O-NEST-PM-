
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Mechanic,
  MechanicStatus,
} from './entities/mechanic.entity.js';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicsRepository: Repository<Mechanic>,
  ) {}

  findAll(): Promise<Mechanic[]> {
    return this.mechanicsRepository.find();
  }

  async findOne(id: number): Promise<Mechanic> {
    const mechanic = await this.mechanicsRepository.findOneBy({ id });

    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    return mechanic;
  }

  async create(data: Partial<Mechanic>): Promise<Mechanic> {
    const mechanic = this.mechanicsRepository.create(data);
    return this.mechanicsRepository.save(mechanic);
  }

  async update(id: number, data: Partial<Mechanic>): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    Object.assign(mechanic, data);
    return this.mechanicsRepository.save(mechanic);
  }

  async deactivate(id: number): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    mechanic.status = MechanicStatus.INACTIVE;
    return this.mechanicsRepository.save(mechanic);
  }

  async activate(id: number): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    mechanic.status = MechanicStatus.ACTIVE;
    return this.mechanicsRepository.save(mechanic);
  }
}
