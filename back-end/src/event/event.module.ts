import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { UserAccountModule } from 'src/user-account/user-account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UserAccountModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
