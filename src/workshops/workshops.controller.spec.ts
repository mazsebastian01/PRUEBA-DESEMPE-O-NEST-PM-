
import { Test, TestingModule } from '@nestjs/testing';
import { WorkshopsController } from './workshops.controller.js';
import { WorkshopsService } from './workshops.service.js';

describe('WorkshopsController', () => {
  let controller: WorkshopsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkshopsController],
      providers: [
        {
          provide: WorkshopsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<WorkshopsController>(WorkshopsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
