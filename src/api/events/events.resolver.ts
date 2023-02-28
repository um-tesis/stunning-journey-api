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
  findOne(@Args('event_id', { type: () => Int }) event_id: number) {
    return this.eventsService.findOne(event_id);
  }

  @Query(() => [Event], { name: 'eventsByOrganization' })
  getEventsByOrganization(@Args('organization_id', { type: () => Int }) organization_id: number) {
    return this.eventsService.getEventsByOrganization(organization_id);
  }

  @Query(() => [Event], { name: 'eventsByProject' })
  getEventsByProject(@Args('project_id', { type: () => Int }) project_id: number) {
    return this.eventsService.getEventsByProject(project_id);
  }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.event_id, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(@Args('event_id', { type: () => Int }) event_id: number) {
    return this.eventsService.remove(event_id);
  }
}
