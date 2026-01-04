import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from 'class-transformer';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';

@Module({
    imports: [TypeOrmModule.forFeature([Permission])],
    providers: [PermissionService],
    exports: [PermissionService],
})
export class PermissionModule {}
