
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { MaintenancesService } from './maintenances.service.js';
import {
  Maintenance,
  MaintenanceStatus,
} from './entities/maintenance.entity.js';
import { Vehicle } from '../vehicles/entities/vehicle.entity.js';
import { Mechanic } from '../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../workshops/entities/workshop.entity.js';

describe('MaintenancesService', () => {
  let service: MaintenancesService;
  let maintenanceRepository: any;
  let vehicleRepository: any;
  let mechanicRepository: any;
  let workshopRepository: any;

  beforeEach(async () => {
    maintenanceRepository = {
      find: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      save: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    vehicleRepository = {
      findOneBy: vi.fn(),
      save: vi.fn(),
    };

    mechanicRepository = {
      findOneBy: vi.fn(),
    };

    workshopRepository = {
      findOneBy: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenancesService,
        {
          provide: getRepositoryToken(Maintenance),
          useValue: maintenanceRepository,
        },
        {
          provide: getRepositoryToken(Vehicle),
          useValue: vehicleRepository,
        },
        {
          provide: getRepositoryToken(Mechanic),
          useValue: mechanicRepository,
        },
        {
          provide: getRepositoryToken(Workshop),
          useValue: workshopRepository,
        },
      ],
    }).compile();

    service = module.get<MaintenancesService>(MaintenancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all maintenances', async () => {
    maintenanceRepository.find.mockResolvedValue([{ id: 1 }]);

    await expect(service.findAll()).resolves.toEqual([{ id: 1 }]);
  });

  it('should find maintenances by vehicle', async () => {
    await service.findByVehicle(1);

    expect(maintenanceRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { vehicle: { id: 1 } },
      }),
    );
  });

  it('should find maintenances by mechanic', async () => {
    await service.findByMechanic(2);

    expect(maintenanceRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { mechanic: { id: 2 } },
      }),
    );
  });

  it('should throw when maintenance does not exist', async () => {
    await expect(service.findOne(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should reject creation when relations are missing', async () => {
    await expect(service.create({})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should reject creation when vehicle does not exist', async () => {
    await expect(
      service.create({
        vehicle: { id: 1 } as Vehicle,
        mechanic: { id: 1 } as Mechanic,
        workshop: { id: 1 } as Workshop,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should reject creation for an inactive vehicle', async () => {
    vehicleRepository.findOneBy.mockResolvedValue({
      id: 1,
      mileage: 100,
      status: 'INACTIVE',
    });

    await expect(
      service.create({
        vehicle: { id: 1 } as Vehicle,
        mechanic: { id: 1 } as Mechanic,
        workshop: { id: 1 } as Workshop,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should reject status changes for missing maintenance', async () => {
    await expect(
      service.updateStatus(99, MaintenanceStatus.IN_PROGRESS),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should reject completing maintenance without closure details', async () => {
    maintenanceRepository.findOne.mockResolvedValue({
      id: 1,
      status: MaintenanceStatus.SCHEDULED,
      vehicle: { id: 1, mileage: 100, status: 'AVAILABLE' },
    });

    await expect(
      service.updateStatus(1, MaintenanceStatus.COMPLETED),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should not change status of completed maintenance', async () => {
    maintenanceRepository.findOne.mockResolvedValue({
      id: 1,
      status: MaintenanceStatus.COMPLETED,
      vehicle: { id: 1 },
    });

    await expect(
      service.updateStatus(1, MaintenanceStatus.IN_PROGRESS),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
