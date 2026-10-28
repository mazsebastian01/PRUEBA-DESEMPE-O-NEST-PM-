
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity.js';
import { Mechanic } from '../../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../../workshops/entities/workshop.entity.js';

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('maintenances')
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @Column()
  description: string;

  @Column({ type: 'int' })
  mileage: number;

  @Column({ type: 'timestamp' })
  scheduledStart: Date;

  @Column({ type: 'timestamp' })
  scheduledEnd: Date;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status: MaintenanceStatus;

  @Column({ nullable: true })
  workPerformed: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalCost: number;

  @Column({ type: 'timestamp', nullable: true })
  completionDate: Date;

  @Column({ type: 'int', nullable: true })
  finalMileage: number;

  @ManyToOne(() => Vehicle, { nullable: false })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @ManyToOne(() => Mechanic, { nullable: false })
  @JoinColumn({ name: 'mechanicId' })
  mechanic: Mechanic;

  @ManyToOne(() => Workshop, { nullable: false })
  @JoinColumn({ name: 'workshopId' })
  workshop: Workshop;
}
