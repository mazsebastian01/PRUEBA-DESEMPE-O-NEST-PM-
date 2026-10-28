import { PartialType } from '@nestjs/mapped-types';
import { CreateMechanicDto } from './create-mechanic.dto.js';

export class UpdateMechanicDto extends PartialType(CreateMechanicDto) {}