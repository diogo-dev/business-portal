import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { UserAccountService } from 'src/user-account/user-account.service';
import { PostStatus } from 'src/post/enum/post-status.enum';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) 
    private readonly eventRepository: Repository<Event>,
    private readonly userAccountService: UserAccountService
  ) {}

  async create(dto: CreateEventDto, creatorId: string): Promise<Event> {
    const creator = await this.userAccountService.findOne(creatorId);

    const slug = this.generateSlug(dto.title);

    const event = this.eventRepository.create({ ...dto, slug: slug, creator: creator });
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

  async findPaginatedEventsByStatus(page: number, limit: number, status: PostStatus) {
    const offset = (page - 1) * limit;
    const orderBy = status === PostStatus.DRAFT ? 'event.createdAt' : 'event.publishedAt';

    const [events, total] = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.creator', 'creator')
      .where('event.status = :status', { status })
      .orderBy(orderBy, 'DESC')
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    return {
      events: events, 
      meta: {
        totalItems: total, 
        itemCount: events.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }
    }
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

  async publishEvent(id: string): Promise<Event> {
    const event = await this.findOne(id);

    if (event.status === PostStatus.PUBLISHED) return event;
    if (event.status !== PostStatus.DRAFT) {
      throw new Error ('Only draft event can be published');
    }

    await this.eventRepository
      .createQueryBuilder()
      .update(Event)
      .set({
        status: PostStatus.PUBLISHED,
        publishedAt: new Date()
      })
      .where('id = :id', { id })
      .execute();

    return await this.findOne(id);
  }

  async archiveEvent(id: string): Promise<Event> {
    const event = await this.findOne(id);

    if (event.status === PostStatus.ARCHIVED) {
      throw new Error('Event is already archived');
    }

    await this.eventRepository
      .createQueryBuilder()
      .update(Event)
      .set({ status: PostStatus.ARCHIVED })
      .where('id = :id', { id })
      .execute();
      
    return await this.findOne(id);
  }

  private generateSlug(title: string): string {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  }
}
