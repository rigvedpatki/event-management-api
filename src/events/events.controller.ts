import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, MoreThan, Repository } from "typeorm";
import { CreateEventDto } from "./create-event.dto";
import { Event } from "./event.entity";
import { UpdateEventDto } from "./update-event.dto";

@Controller('/events')
export class EventsController {

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>
  ) { }

  @Get()
  public async findAll(): Promise<Event[]> {
    return this.repository.find();
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
    return this.repository.findOne(eventId);
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
    this.repository.remove(event);
  }
}