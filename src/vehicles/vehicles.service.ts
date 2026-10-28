
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleStatus } from './entities/vehicle.entity.js';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
  ) {}

  findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find();
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOneBy({ id });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async findByPlate(plate: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOneBy({ plate });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = this.vehiclesRepository.create(data);
    return this.vehiclesRepository.save(vehicle);
  }

  async update(id: number, data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, data);
    return this.vehiclesRepository.save(vehicle);
  }

  async deactivate(id: number): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    vehicle.status = VehicleStatus.INACTIVE;
    return this.vehiclesRepository.save(vehicle);
  }
}
