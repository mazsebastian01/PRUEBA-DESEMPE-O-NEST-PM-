
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkshopsService } from './workshops.service.js';
import { Workshop } from './entities/workshop.entity.js';

describe('WorkshopsService', () => {
  let service: WorkshopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkshopsService,
        {
          provide: getRepositoryToken(Workshop),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WorkshopsService>(WorkshopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
