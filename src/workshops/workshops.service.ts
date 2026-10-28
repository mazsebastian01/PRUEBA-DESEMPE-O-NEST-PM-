
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Workshop,
  WorkshopStatus,
} from './entities/workshop.entity.js';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopsRepository: Repository<Workshop>,
  ) {}

  findAll(): Promise<Workshop[]> {
    return this.workshopsRepository.find();
  }

  findActive(): Promise<Workshop[]> {
    return this.workshopsRepository.findBy({
      status: WorkshopStatus.ACTIVE,
    });
  }

  async findOne(id: number): Promise<Workshop> {
    const workshop = await this.workshopsRepository.findOneBy({ id });

    if (!workshop) {
      throw new NotFoundException('Workshop not found');
    }

    return workshop;
  }

  async create(data: Partial<Workshop>): Promise<Workshop> {
    const workshop = this.workshopsRepository.create(data);
    return this.workshopsRepository.save(workshop);
  }

  async update(id: number, data: Partial<Workshop>): Promise<Workshop> {
    const workshop = await this.findOne(id);
    Object.assign(workshop, data);
    return this.workshopsRepository.save(workshop);
  }

  async deactivate(id: number): Promise<Workshop> {
    const workshop = await this.findOne(id);
    workshop.status = WorkshopStatus.INACTIVE;
    return this.workshopsRepository.save(workshop);
  }

  async activate(id: number): Promise<Workshop> {
    const workshop = await this.findOne(id);
    workshop.status = WorkshopStatus.ACTIVE;
    return this.workshopsRepository.save(workshop);
  }
}
