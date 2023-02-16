import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  public async create(createEventInput: CreateEventInput) {
    return await this.prisma.event.create({
      data: createEventInput,
    });
  }

  public async findAll() {
    return await this.prisma.event.findMany();
  }

  public async findOne(event_id: number) {
    return await this.prisma.event.findUnique({
      where: {
        event_id,
      },
    });
  }

  public async update(event_id: number, updateEventInput: UpdateEventInput) {
    return await this.prisma.event.update({
      where: {
        event_id,
      },
      data: updateEventInput,
    });
  }

  public async remove(event_id: number) {
    return await this.prisma.event.delete({
      where: {
        event_id,
      },
    });
  }

  public async getEventsByOrganization(organization_id: number) {
    return await this.prisma.event.findMany({
      where: {
        organization_id,
      },
    });
  }

  public async getEventsByProject(project_id: number) {
    return await this.prisma.event.findMany({
      where: {
        project_id,
      },
    });
  }
}
