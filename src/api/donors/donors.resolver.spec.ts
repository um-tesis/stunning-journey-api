import { Test, TestingModule } from '@nestjs/testing';
import { DonorsResolver } from './donors.resolver';
import { DonorsService } from './donors.service';

describe('DonorsResolver', () => {
  let resolver: DonorsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonorsResolver, DonorsService],
    }).compile();

    resolver = module.get<DonorsResolver>(DonorsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
