import { Test, TestingModule } from '@nestjs/testing';
import { BillingsResolver } from './billings.resolver';
import { BillingsService } from './billings.service';

describe('BillingsResolver', () => {
  let resolver: BillingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingsResolver, BillingsService],
    }).compile();

    resolver = module.get<BillingsResolver>(BillingsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
