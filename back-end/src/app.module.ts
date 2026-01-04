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
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/roles.guard';
import { PermissionsGuard } from './permission/permissions.guard';
import { RoleService } from './role/role.service';
import { RoleModule } from './role/role.module';
import { PermissionService } from './permission/permission.service';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserAccountModule,
    PostModule,
    EventModule,
    PostCommentModule,
    AuthModule,
    RoleModule,
    PermissionModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthModule
    },
     {
      provide: APP_GUARD,
      useClass: RolesGuard
     },
     {
      provide: APP_GUARD,
      useClass: PermissionsGuard
     }
  ],
})

export class AppModule {}
