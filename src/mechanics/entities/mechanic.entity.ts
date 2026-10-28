
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MechanicStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('mechanics')
export class Mechanic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  specialty: string;

  @Column({
    type: 'enum',
    enum: MechanicStatus,
    default: MechanicStatus.ACTIVE,
  })
  status: MechanicStatus;
}
