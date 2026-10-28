import {
  IsEnum,
  IsInt,
  IsString,
  IsDateString,
  IsNumber,
  Min,
  MinLength,
} from 'class-validator';
import { MaintenanceType } from '../entities/maintenance.entity.js';

export class CreateMaintenanceDto {
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @IsString()
  @MinLength(1)
  description: string;

  @IsInt()
  @Min(0)
  mileage: number;

  @IsDateString()
  scheduledStart: string;

  @IsDateString()
  scheduledEnd: string;

  @IsInt()
  @Min(1)
  vehicleId: number;

  @IsInt()
  @Min(1)
  mechanicId: number;

  @IsInt()
  @Min(1)
  workshopId: number;
}