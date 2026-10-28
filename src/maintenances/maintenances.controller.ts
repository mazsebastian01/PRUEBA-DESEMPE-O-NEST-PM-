
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { MaintenancesService } from './maintenances.service.js';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto.js';
import { MaintenanceStatus } from './entities/maintenance.entity.js';
import { Roles } from '../auth/decorators/roles/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard.js';

@ApiBearerAuth('bearer')
@Controller('maintenances')
export class MaintenancesController {
  constructor(
    private readonly maintenancesService: MaintenancesService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Post()
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    const {
      vehicleId,
      mechanicId,
      workshopId,
      scheduledStart,
      scheduledEnd,
      ...maintenanceData
    } = createMaintenanceDto;

    return this.maintenancesService.create({
      ...maintenanceData,
      vehicle: { id: vehicleId } as any,
      mechanic: { id: mechanicId } as any,
      workshop: { id: workshopId } as any,
      scheduledStart: new Date(scheduledStart),
      scheduledEnd: new Date(scheduledEnd),
    });
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @Get()
  findAll() {
    return this.maintenancesService.findAll();
  }

  @Get('vehicle/:vehicleId')
  findByVehicle(
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
  ) {
    return this.maintenancesService.findByVehicle(vehicleId);
  }

  @Get('mechanic/:mechanicId')
  findByMechanic(
    @Param('mechanicId', ParseIntPipe) mechanicId: number,
  ) {
    return this.maintenancesService.findByMechanic(mechanicId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.maintenancesService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: {
      status: MaintenanceStatus;
      workPerformed?: string;
      finalCost?: number;
      completionDate?: Date;
      finalMileage?: number;
    },
  ) {
    const { status, ...closure } = data;

    return this.maintenancesService.updateStatus(
      id,
      status,
      closure,
    );
  }
}
