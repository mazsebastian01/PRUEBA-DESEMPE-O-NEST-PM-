
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MaintenancesController } from './maintenances.controller.js';
import { MaintenancesService } from './maintenances.service.js';
import { MaintenanceStatus } from './entities/maintenance.entity.js';

describe('MaintenancesController', () => {
  let controller: MaintenancesController;
  let service: {
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    findByVehicle: ReturnType<typeof vi.fn>;
    findByMechanic: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    updateStatus: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    service = {
      findAll: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue({ id: 1 }),
      findByVehicle: vi.fn().mockResolvedValue([]),
      findByMechanic: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({ id: 1 }),
      updateStatus: vi.fn().mockResolvedValue({ id: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenancesController],
      providers: [
        { provide: MaintenancesService, useValue: service },
        {
          provide: ConfigService,
          useValue: { get: () => 'FleetCore2026Key' },
        },
      ],
    }).compile();

    controller = module.get<MaintenancesController>(
      MaintenancesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all maintenances', async () => {
    await expect(controller.findAll()).resolves.toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a maintenance by id', async () => {
    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should return maintenances by vehicle', async () => {
    await controller.findByVehicle(2);
    expect(service.findByVehicle).toHaveBeenCalledWith(2);
  });

  it('should return maintenances by mechanic', async () => {
    await controller.findByMechanic(3);
    expect(service.findByMechanic).toHaveBeenCalledWith(3);
  });

  it('should create a maintenance and convert dates', async () => {
    const data = {
      description: 'Oil change',
      vehicleId: 1,
      mechanicId: 1,
      workshopId: 1,
      scheduledStart: '2026-10-28T09:00:00.000Z',
      scheduledEnd: '2026-10-28T10:00:00.000Z',
    };

    await controller.create(data as any);

    expect(service.create).toHaveBeenCalledWith({
      description: data.description,
      vehicle: { id: data.vehicleId },
      mechanic: { id: data.mechanicId },
      workshop: { id: data.workshopId },
      scheduledStart: new Date(data.scheduledStart),
      scheduledEnd: new Date(data.scheduledEnd),
    });
  });

  it('should update maintenance status', async () => {
    await controller.updateStatus(1, {
      status: MaintenanceStatus.IN_PROGRESS,
    });

    expect(service.updateStatus).toHaveBeenCalledWith(
      1,
      MaintenanceStatus.IN_PROGRESS,
      {},
    );
  });
});
