
import {
  IsEnum,
  IsInt,
  IsString,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { VehicleStatus } from '../entities/vehicle.entity.js';

export class CreateVehicleDto {
  @IsString()
  @MinLength(1)
  plate: string;

  @IsString()
  @MinLength(1)
  brand: string;

  @IsString()
  @MinLength(1)
  model: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @IsInt()
  @Min(0)
  mileage: number;

  @IsEnum(VehicleStatus)
  status: VehicleStatus;
}
