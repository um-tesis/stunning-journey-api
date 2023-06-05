import { Module } from '@nestjs/common';
import { BillingsService } from './billings.service';
import { BillingsResolver } from './billings.resolver';
import { BadgrService } from '../projects/badgr.service';

@Module({
  providers: [BillingsResolver, BillingsService, BadgrService],
})
export class BillingsModule {}
