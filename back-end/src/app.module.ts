import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountModule } from './user-account/user-account.module';
import { PostModule } from './post/post.module';
import { EventModule } from './event/event.module';
import { dataSourceOptions } from './database/data-source'
import { PostCommentModule } from './post-comment/post-comment.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/roles.guard';
import { PermissionsGuard } from './permission/permissions.guard';
import { RoleModule } from './role/role.module';
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
      useClass: RolesGuard
     },
     {
      provide: APP_GUARD,
      useClass: PermissionsGuard
     }
  ],
})

export class AppModule {}
