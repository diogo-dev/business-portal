import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) private roleRepository: Repository<Role>) {}

    async create(dto: CreateRoleDto): Promise<Role> {
        const role = this.roleRepository.create(dto);
        return this.roleRepository.save(role);
    }

    async findByName(name: string): Promise<Role | null> {
        return this.roleRepository.findOne({
            where: { name },
            relations: ['permissions']
        });
    }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find({ relations: ['permissions'] });
    }

    async count(): Promise<number> {
        return this.roleRepository.count();
    }
}
