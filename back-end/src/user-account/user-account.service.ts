import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccount } from './entities/user-account.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserAccountService {

  constructor(
    @InjectRepository(UserAccount) 
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly roleService: RoleService
  ) {}

  async create(createUserAccountDto: CreateUserAccountDto) {
    // verify if email already exists
    const existingEmail = await this.userAccountRepository.findOne({ 
      where: { email: createUserAccountDto.email } 
    });

    if (existingEmail) {
      throw new ConflictException(`Email ${createUserAccountDto.email} already in use`);
    }

    // verify if phone number already exists
    const existingPhoneNumber = await this.userAccountRepository.findOne({ 
      where: { phone: createUserAccountDto.phone } 
    });

    if (existingPhoneNumber) {
      throw new ConflictException(`Phone number ${createUserAccountDto.phone} already in use`);
    }

    const roleName = createUserAccountDto.role ?? 'user';
    const role = await this.roleService.findByName(roleName);

    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    const newUserAccount = this.userAccountRepository.create({
      ...createUserAccountDto,
      roles: [role]
    });

    return await this.userAccountRepository.save(newUserAccount);
  }

  async findAll(): Promise<UserAccount[]> {
    return await this.userAccountRepository.find();
  }

  async findOne(id: string): Promise<UserAccount> {
    try {
      return await this.userAccountRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<UserAccount> {
    try {
      return await this.userAccountRepository.findOneOrFail({ where: { email } , relations: ['posts', 'events', 'roles'] })
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      throw error;
    }
  }

  async update(id: string, updateUserAccountDto: UpdateUserAccountDto): Promise<UserAccount> {
    const account = await this.findOne(id);
    return await this.userAccountRepository.save({ ...account, ...updateUserAccountDto })
  }

  async remove(id: string): Promise<UserAccount> {
    const account = await this.findOne(id);
    return await this.userAccountRepository.remove(account);
  }

  async count(): Promise<number> {
        return this.userAccountRepository.count();
  }
}
