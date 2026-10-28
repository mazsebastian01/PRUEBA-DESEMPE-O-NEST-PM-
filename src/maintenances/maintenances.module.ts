
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenancesService } from './maintenances.service.js';
import { MaintenancesController } from './maintenances.controller.js';
import { Maintenance } from './entities/maintenance.entity.js';
import { Vehicle } from '../vehicles/entities/vehicle.entity.js';
import { Mechanic } from '../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../workshops/entities/workshop.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Maintenance,
      Vehicle,
      Mechanic,
      Workshop,
    ]),
  ],
  controllers: [MaintenancesController],
  providers: [MaintenancesService],
})
export class MaintenancesModule {}
