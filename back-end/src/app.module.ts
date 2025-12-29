import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountModule } from './user-account/user-account.module';
import { PostModule } from './post/post.module';
import { EventModule } from './event/event.module';
import { dataSourceOptions } from './database/data-source'
import { UserAccount } from './user-account/entities/user-account.entity';
import { Post } from './post/entities/post.entity';
import { Event } from './event/entities/event.entity';
import { PostCommentModule } from './post-comment/post-comment.module';
import { PostComment } from './post-comment/entities/post-comment.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([UserAccount, Post, Event, PostComment]),
    UserAccountModule,
    PostModule,
    EventModule,
    PostCommentModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
