import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, MoreThan, Repository } from "typeorm";
import { CreateEventDto } from "./create-event.dto";
import { Event } from "./event.entity";
import { UpdateEventDto } from "./update-event.dto";

@Controller('/events')
export class EventsController {

  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>
  ) { }

  @Get()
  public async findAll(): Promise<Event[]> {
    this.logger.log(`Hit the findAll route`);
    const events = await this.repository.find();
    this.logger.debug(`Found ${events.length} events`);
    return events
  }

  @Get('/practice')
  public async practice() {
    return this.repository.find({
      select: ['id', 'when'],
      where: [{
        id: MoreThan(3),
        when: MoreThan(new Date('2021-02-12T13:00:00'))
      }, {
        description: Like('%meet%')
      }],
      take: 2,
      order: {
        id: 'DESC'
      }
    });
  }

  @Get('/:eventId')
  public async findOne(@Param('eventId', ParseIntPipe) eventId: number): Promise<Event> {
    const event = await this.repository.findOne(eventId);
    if (!event) {
      throw new NotFoundException()
    }
    return event;
  }

  @Post()
  public async create(@Body() requestBody: CreateEventDto): Promise<Event> {
    const event = await this.repository.save({
      ...requestBody,
      when: new Date(requestBody.when)
    })

    return event;
  }

  @Patch('/:eventId')
  public async update(@Param('eventId') eventId: string, @Body() requestBody: UpdateEventDto): Promise<Event> {
    const event = await this.repository.findOne(eventId);

    if (!event) {
      throw new NotFoundException()
    }

    return this.repository.save({
      ...event,
      ...requestBody,
      when: requestBody.when ? new Date(requestBody.when) : event.when
    })
  }

  @Delete('/:eventId')
  @HttpCode(204)
  public async remove(@Param('eventId') eventId: string,): Promise<void> {
    const event = await this.repository.findOne(eventId);

    if (!event) {
      throw new NotFoundException()
    }

    this.repository.remove(event);
  }
}