import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
    constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}

    async create(dto: CreatePermissionDto): Promise<Permission> {
        const permission = this.permissionRepository.create(dto);
        return this.permissionRepository.save(permission);
    }

    async createMany(dto: CreatePermissionDto[]): Promise<Permission[]> {
        const permissions = this.permissionRepository.create(dto);
        return this.permissionRepository.save(permissions);
    }

    async findAll(): Promise<Permission[]> {
        return this.permissionRepository.find();
    }

    async count(): Promise<number> {
        return this.permissionRepository.count();
    }

    async findByNames(names: string[]): Promise<Permission[]> {
        return this.permissionRepository
            .createQueryBuilder('permission')
            .where('permission.name IN (:...names)', { names })
            .getMany();
    }
}
