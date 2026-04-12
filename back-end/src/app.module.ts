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
import { AuthGuard } from './auth/auth.guard';
import { UploadModule } from './upload/upload.module';
import { CategoryModule } from './category/category.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_S3_URL: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserAccountModule,
    PostModule,
    EventModule,
    PostCommentModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    UploadModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
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
