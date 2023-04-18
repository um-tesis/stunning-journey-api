import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventsService.create(createEventInput);
  }

  @Query(() => [Event], { name: 'events' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Query(() => Event, { name: 'event' })
  findOne(@Args('eventId', { type: () => Int }) id: number) {
    return this.eventsService.findOne(id);
  }

  @Query(() => [Event], { name: 'eventsByOrganization' })
  getEventsByOrganization(@Args('organizationId', { type: () => Int }) organizationId: number) {
    return this.eventsService.getEventsByOrganization(organizationId);
  }

  @Query(() => [Event], { name: 'eventsByProject' })
  getEventsByProject(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.eventsService.getEventsByProject(projectId);
  }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(@Args('eventId', { type: () => Int }) id: number) {
    return this.eventsService.remove(id);
  }
}
