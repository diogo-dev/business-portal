import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(dto)
    return await this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find({ relations: ['creator'] });
  }

  async findOne(id: string): Promise<Event> {
    const event =  await this.eventRepository.findOneOrFail({ where: { id }, relations: ['creator'] });

    if (!event) throw new NotFoundException(`Event with id ${id} not found!`);

    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    //this.eventRepository.merge(event, dto);
    return await this.eventRepository.save({...event, ...dto});
  }

  async remove(id: string): Promise<Event> {
    const event = await this.findOne(id);
    return await this.eventRepository.remove(event);
  }
}
