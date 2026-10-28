import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';
import { MechanicStatus } from '../entities/mechanic.entity.js';

export class CreateMechanicDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  specialty: string;

  @IsEnum(MechanicStatus)
  status: MechanicStatus;
}