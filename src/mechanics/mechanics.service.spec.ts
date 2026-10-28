
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MechanicsService } from './mechanics.service.js';
import { Mechanic } from './entities/mechanic.entity.js';

describe('MechanicsService', () => {
  let service: MechanicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MechanicsService,
        {
          provide: getRepositoryToken(Mechanic),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MechanicsService>(MechanicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
