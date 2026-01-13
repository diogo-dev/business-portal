import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { UserAccountService } from 'src/user-account/user-account.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) 
    private readonly eventRepository: Repository<Event>,
    private readonly userAccountService: UserAccountService
  ) {}

  async create(dto: CreateEventDto, creatorId: string): Promise<Event> {
    const creator = await this.userAccountService.findOne(creatorId);

    const event = this.eventRepository.create({ ...dto, creator: creator });
    return await this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find({ relations: ['creator'] });
  }

  async findOne(id: string): Promise<Event> {
    try {
      return await this.eventRepository.findOneOrFail({ where: { id }, relations: ['creator'] });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
     throw error;
    }

    // if I chose to use findOne instead of findOneOrFail
    // const event = await this.eventRepository.findOne({ where: { id } });
    // if (!event) {
    //   throw new NotFoundException(`Event with ID ${id} not found`);
    // }
    // return event;
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
