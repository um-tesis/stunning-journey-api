import { Injectable } from '@nestjs/common';

import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  public async create(createEventInput: CreateEventInput) {
    return this.prisma.event.create({
      data: createEventInput,
    });
  }

  public async findAll() {
    return this.prisma.event.findMany();
  }

  public async findOne(id: number) {
    return this.prisma.event.findUnique({
      where: {
        id,
      },
    });
  }

  public async update(id: number, updateEventInput: UpdateEventInput) {
    return this.prisma.event.update({
      where: {
        id,
      },
      data: updateEventInput,
    });
  }

  public async remove(id: number) {
    return this.prisma.event.delete({
      where: {
        id,
      },
    });
  }

  public async getEventsByOrganization(organizationId: number) {
    return await this.prisma.event.findMany({
      where: {
        organizationId,
      },
    });
  }

  public async getEventsByProject(projectId: number) {
    return this.prisma.event.findMany({
      where: {
        projectId,
      },
    });
  }
}
