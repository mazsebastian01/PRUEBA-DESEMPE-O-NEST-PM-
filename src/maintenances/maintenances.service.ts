
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Maintenance,
  MaintenanceStatus,
} from './entities/maintenance.entity.js';
import {
  Vehicle,
  VehicleStatus,
} from '../vehicles/entities/vehicle.entity.js';
import {
  Mechanic,
  MechanicStatus,
} from '../mechanics/entities/mechanic.entity.js';
import {
  Workshop,
  WorkshopStatus,
} from '../workshops/entities/workshop.entity.js';

@Injectable()
export class MaintenancesService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenancesRepository: Repository<Maintenance>,
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Mechanic)
    private readonly mechanicsRepository: Repository<Mechanic>,
    @InjectRepository(Workshop)
    private readonly workshopsRepository: Repository<Workshop>,
  ) {}

  findAll(): Promise<Maintenance[]> {
    return this.maintenancesRepository.find({
      relations: {
        vehicle: true,
        mechanic: true,
        workshop: true,
      },
    });
  }

  async findOne(id: number): Promise<Maintenance> {
    const maintenance = await this.maintenancesRepository.findOne({
      where: { id },
      relations: {
        vehicle: true,
        mechanic: true,
        workshop: true,
      },
    });

    if (!maintenance) {
      throw new NotFoundException('Maintenance not found');
    }

    return maintenance;
  }

  findByVehicle(vehicleId: number): Promise<Maintenance[]> {
    return this.maintenancesRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: {
        vehicle: true,
        mechanic: true,
        workshop: true,
      },
    });
  }

  findByMechanic(mechanicId: number): Promise<Maintenance[]> {
    return this.maintenancesRepository.find({
      where: { mechanic: { id: mechanicId } },
      relations: {
        vehicle: true,
        mechanic: true,
        workshop: true,
      },
    });
  }

  async create(data: Partial<Maintenance>): Promise<Maintenance> {
    if (
      !data.vehicle?.id ||
      !data.mechanic?.id ||
      !data.workshop?.id
    ) {
      throw new BadRequestException(
        'Vehicle, mechanic, and workshop are required',
      );
    }

    const vehicle = await this.vehiclesRepository.findOneBy({
      id: data.vehicle.id,
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.status === VehicleStatus.INACTIVE) {
      throw new ConflictException(
        'Inactive vehicles cannot be assigned',
      );
    }

    const mechanic = await this.mechanicsRepository.findOneBy({
      id: data.mechanic.id,
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    if (mechanic.status !== MechanicStatus.ACTIVE) {
      throw new ConflictException(
        'Inactive mechanics cannot be assigned',
      );
    }

    const workshop = await this.workshopsRepository.findOneBy({
      id: data.workshop.id,
    });

    if (!workshop) {
      throw new NotFoundException('Workshop not found');
    }

    if (workshop.status !== WorkshopStatus.ACTIVE) {
      throw new ConflictException(
        'Inactive workshops cannot be assigned',
      );
    }

    if (data.mileage === undefined || data.mileage < vehicle.mileage) {
      throw new BadRequestException(
        'Maintenance mileage cannot be less than vehicle mileage',
      );
    }

    if (!data.scheduledStart || !data.scheduledEnd) {
      throw new BadRequestException(
        'Scheduled start and end are required',
      );
    }

    const scheduledStart = new Date(data.scheduledStart);
    const scheduledEnd = new Date(data.scheduledEnd);

    if (
      Number.isNaN(scheduledStart.getTime()) ||
      Number.isNaN(scheduledEnd.getTime()) ||
      scheduledStart >= scheduledEnd
    ) {
      throw new BadRequestException('Invalid maintenance schedule');
    }

    const activeStatuses = [
      MaintenanceStatus.SCHEDULED,
      MaintenanceStatus.IN_PROGRESS,
    ];

    const vehicleConflict = await this.maintenancesRepository
      .createQueryBuilder('maintenance')
      .where('maintenance.vehicleId = :vehicleId', {
        vehicleId: vehicle.id,
      })
      .andWhere('maintenance.status IN (:...statuses)', {
        statuses: activeStatuses,
      })
      .andWhere('maintenance.scheduledStart < :end', {
        end: scheduledEnd,
      })
      .andWhere('maintenance.scheduledEnd > :start', {
        start: scheduledStart,
      })
      .getOne();

    if (vehicleConflict) {
      throw new ConflictException(
        'Vehicle already has an overlapping active maintenance',
      );
    }

    const mechanicConflict = await this.maintenancesRepository
      .createQueryBuilder('maintenance')
      .where('maintenance.mechanicId = :mechanicId', {
        mechanicId: mechanic.id,
      })
      .andWhere('maintenance.status IN (:...statuses)', {
        statuses: activeStatuses,
      })
      .andWhere('maintenance.scheduledStart < :end', {
        end: scheduledEnd,
      })
      .andWhere('maintenance.scheduledEnd > :start', {
        start: scheduledStart,
      })
      .getOne();

    if (mechanicConflict) {
      throw new ConflictException(
        'Mechanic already has an overlapping active maintenance',
      );
    }

    const maintenance = this.maintenancesRepository.create({
      ...data,
      vehicle,
      mechanic,
      workshop,
      scheduledStart,
      scheduledEnd,
      status: MaintenanceStatus.SCHEDULED,
    });

    return this.maintenancesRepository.save(maintenance);
  }

  async updateStatus(
    id: number,
    status: MaintenanceStatus,
    closure?: {
      workPerformed?: string;
      finalCost?: number;
      completionDate?: Date;
      finalMileage?: number;
    },
  ): Promise<Maintenance> {
    const maintenance = await this.findOne(id);

    if (
      maintenance.status === MaintenanceStatus.COMPLETED ||
      maintenance.status === MaintenanceStatus.CANCELLED
    ) {
      throw new ConflictException(
        'Completed or cancelled maintenance cannot change status',
      );
    }

    if (
      status === MaintenanceStatus.SCHEDULED &&
      maintenance.status !== MaintenanceStatus.SCHEDULED
    ) {
      throw new ConflictException(
        'Invalid maintenance status transition',
      );
    }

    if (
      status === MaintenanceStatus.COMPLETED &&
      (!closure?.workPerformed ||
        closure.finalCost === undefined ||
        !closure.completionDate ||
        closure.finalMileage === undefined)
    ) {
      throw new BadRequestException(
        'Completion requires work performed, final cost, completion date, and final mileage',
      );
    }

    if (status === MaintenanceStatus.IN_PROGRESS) {
      maintenance.vehicle.status = VehicleStatus.IN_MAINTENANCE;
      await this.vehiclesRepository.save(maintenance.vehicle);
    }

    if (status === MaintenanceStatus.COMPLETED) {
      if (!closure) {
        throw new BadRequestException('Closure details are required');
      }

      maintenance.vehicle.status = VehicleStatus.AVAILABLE;
      maintenance.vehicle.mileage = closure.finalMileage!;
      await this.vehiclesRepository.save(maintenance.vehicle);

      maintenance.workPerformed = closure.workPerformed!;
      maintenance.finalCost = closure.finalCost!;
      maintenance.completionDate = closure.completionDate!;
      maintenance.finalMileage = closure.finalMileage!;
    }

    maintenance.status = status;
    return this.maintenancesRepository.save(maintenance);
  }
}
