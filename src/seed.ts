
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  UserRole,
} from './users/entities/user.entity.js';
import {
  Mechanic,
  MechanicStatus,
} from './mechanics/entities/mechanic.entity.js';
import {
  Workshop,
  WorkshopStatus,
} from './workshops/entities/workshop.entity.js';
import {
  Vehicle,
  VehicleStatus,
} from './vehicles/entities/vehicle.entity.js';
import {
  Maintenance,
  MaintenanceType,
  MaintenanceStatus,
} from './maintenances/entities/maintenance.entity.js';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5433),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Mechanic, Workshop, Vehicle, Maintenance],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();

  try {
    const users = dataSource.getRepository(User);
    const mechanics = dataSource.getRepository(Mechanic);
    const workshops = dataSource.getRepository(Workshop);
    const vehicles = dataSource.getRepository(Vehicle);
    const maintenances = dataSource.getRepository(Maintenance);

    const password = await bcrypt.hash('FleetCore123!', 10);

    const userData = [
      { email: 'admin@fleetcore.com', role: UserRole.ADMIN },
      { email: 'tech1@fleetcore.com', role: UserRole.TECHNICIAN },
      { email: 'tech2@fleetcore.com', role: UserRole.TECHNICIAN },
    ];

    for (const data of userData) {
      if (!(await users.findOneBy({ email: data.email }))) {
        await users.save(users.create({ ...data, password }));
      }
    }

    const mechanicData = [
      {
        name: 'Carlos Mendoza',
        email: 'tech1@fleetcore.com',
        specialty: 'Motor',
        status: MechanicStatus.ACTIVE,
      },
      {
        name: 'Andrés Pérez',
        email: 'tech2@fleetcore.com',
        specialty: 'Frenos',
        status: MechanicStatus.ACTIVE,
      },
      {
        name: 'Luis Torres',
        email: 'luis@fleetcore.com',
        specialty: 'Electricidad',
        status: MechanicStatus.INACTIVE,
      },
    ];

    for (const data of mechanicData) {
      if (!(await mechanics.findOneBy({ email: data.email }))) {
        await mechanics.save(mechanics.create(data));
      }
    }

    const workshopData = [
      {
        name: 'Taller Central',
        address: 'Calle 30 #20-10',
        status: WorkshopStatus.ACTIVE,
      },
      {
        name: 'Taller Norte',
        address: 'Carrera 50 #80-20',
        status: WorkshopStatus.INACTIVE,
      },
    ];

    for (const data of workshopData) {
      if (!(await workshops.findOneBy({ name: data.name }))) {
        await workshops.save(workshops.create(data));
      }
    }

    const vehicleData = [
      {
        plate: 'FCR101',
        brand: 'Toyota',
        model: 'Hilux',
        year: 2023,
        mileage: 15000,
        status: VehicleStatus.AVAILABLE,
      },
      {
        plate: 'FCR102',
        brand: 'Chevrolet',
        model: 'NPR',
        year: 2022,
        mileage: 22000,
        status: VehicleStatus.AVAILABLE,
      },
      {
        plate: 'FCR103',
        brand: 'Ford',
        model: 'Ranger',
        year: 2024,
        mileage: 8000,
        status: VehicleStatus.IN_MAINTENANCE,
      },
      {
        plate: 'FCR104',
        brand: 'Nissan',
        model: 'Frontier',
        year: 2021,
        mileage: 30000,
        status: VehicleStatus.INACTIVE,
      },
    ];

    for (const data of vehicleData) {
      if (!(await vehicles.findOneBy({ plate: data.plate }))) {
        await vehicles.save(vehicles.create(data));
      }
    }

    const mechanic1 = await mechanics.findOneByOrFail({
      email: 'tech1@fleetcore.com',
    });
    const mechanic2 = await mechanics.findOneByOrFail({
      email: 'tech2@fleetcore.com',
    });
    const workshop = await workshops.findOneByOrFail({
      name: 'Taller Central',
    });
    const vehicle1 = await vehicles.findOneByOrFail({ plate: 'FCR101' });
    const vehicle2 = await vehicles.findOneByOrFail({ plate: 'FCR102' });
    const vehicle3 = await vehicles.findOneByOrFail({ plate: 'FCR103' });

    const completed = await maintenances.findOne({
      where: {
        vehicle: { id: vehicle1.id },
        status: MaintenanceStatus.COMPLETED,
      },
    });

    if (!completed) {
      await maintenances.save(
        maintenances.create({
          type: MaintenanceType.PREVENTIVE,
          description: 'Mantenimiento preventivo general',
          mileage: vehicle1.mileage,
          scheduledStart: new Date('2026-10-01T09:00:00'),
          scheduledEnd: new Date('2026-10-01T11:00:00'),
          status: MaintenanceStatus.COMPLETED,
          workPerformed: 'Cambio de aceite y revisión general',
          finalCost: 350000,
          completionDate: new Date('2026-10-01T11:00:00'),
          finalMileage: vehicle1.mileage,
          vehicle: vehicle1,
          mechanic: mechanic1,
          workshop,
        }),
      );
    }

    const inProgress = await maintenances.findOne({
      where: {
        vehicle: { id: vehicle3.id },
        status: MaintenanceStatus.IN_PROGRESS,
      },
    });

    if (!inProgress) {
      await maintenances.save(
        maintenances.create({
          type: MaintenanceType.CORRECTIVE,
          description: 'Revisión de sistema de frenos',
          mileage: vehicle3.mileage,
          scheduledStart: new Date('2026-10-27T09:00:00'),
          scheduledEnd: new Date('2026-10-27T12:00:00'),
          status: MaintenanceStatus.IN_PROGRESS,
          vehicle: vehicle3,
          mechanic: mechanic2,
          workshop,
        }),
      );
    }

    const scheduled = await maintenances.findOne({
      where: {
        vehicle: { id: vehicle2.id },
        status: MaintenanceStatus.SCHEDULED,
      },
    });

    if (!scheduled) {
      await maintenances.save(
        maintenances.create({
          type: MaintenanceType.PREVENTIVE,
          description: 'Inspección programada',
          mileage: vehicle2.mileage,
          scheduledStart: new Date('2026-11-02T09:00:00'),
          scheduledEnd: new Date('2026-11-02T11:00:00'),
          status: MaintenanceStatus.SCHEDULED,
          vehicle: vehicle2,
          mechanic: mechanic1,
          workshop,
        }),
      );
    }
console.log('Seeder executed successfully');
console.log('Admin: admin@fleetcore.com');
console.log('Password: FleetCore123!');
console.log('Technicians: tech1@fleetcore.com, tech2@fleetcore.com');
console.log('Password for both: FleetCore123!');
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error('Error executing the seeder:', error);
  process.exitCode = 1;
});
