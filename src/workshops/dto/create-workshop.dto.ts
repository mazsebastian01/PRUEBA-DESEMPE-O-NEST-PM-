import { IsEnum, IsString, MinLength } from 'class-validator';
import { WorkshopStatus } from '../entities/workshop.entity.js';

export class CreateWorkshopDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  address: string;

  @IsEnum(WorkshopStatus)
  status: WorkshopStatus;
}