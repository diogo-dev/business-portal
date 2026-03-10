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

  verifyCreateUserAccountDto = async (createUserAccountDto: CreateUserAccountDto) => {
    // verify if email already exists
    const existingEmail = await this.userAccountRepository.findOne({ 
      where: { email: createUserAccountDto.email } 
    });

    if (existingEmail) {
      throw new ConflictException(`Email ${createUserAccountDto.email} already in use`);
    }

    // verify if phone number already exists
    const existingPhoneNumber = await this.userAccountRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.profile', 'profile')
      .where('profile.phone = :phone', { phone: createUserAccountDto.profile.phone })
      .getOne();

    if (existingPhoneNumber) {
      throw new ConflictException(`Phone number ${createUserAccountDto.profile.phone} already in use`);
    }

    const roleNames = createUserAccountDto.roleNames ?? ['user'];
    
    const roles = await Promise.all(
      roleNames.map( async (roleName) => {
        const role = await this.roleService.findByName(roleName);
        if (!role) {
          throw new NotFoundException(`Role ${roleName} not found`);
        }
        return role;
      })
    )

    return roles;
  }

  async create(createUserAccountDto: CreateUserAccountDto) {
    const roles = await this.verifyCreateUserAccountDto(createUserAccountDto);    

    const newUserAccount = this.userAccountRepository.create({
      email: createUserAccountDto.email,
      passwordHash: createUserAccountDto.passwordHash,
      userName: createUserAccountDto.userName,
      profile: {
        firstName: createUserAccountDto.userName || '',
        lastName: '',
        bio: '',
        avatarUrl: '',
        phone: createUserAccountDto.profile.phone,
        postalCode: '',
        city: '',
        state: '',
        country: '',
        occupation: ''
      },
      roles: roles
    });

    return await this.userAccountRepository.save(newUserAccount);
  }

  async findAll(): Promise<UserAccount[]> {
    return await this.userAccountRepository.find();
  }

  async findOne(id: string): Promise<UserAccount> {
    try {
      return await this.userAccountRepository.findOneOrFail({ where: { id }, relations: ['profile'] });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<UserAccount> {
    try {
      return await this.userAccountRepository.findOneOrFail({ where: { email } , relations: ['posts', 'events', 'profile'] })
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      throw error;
    }
  }

  async update(id: string, updateUserAccountDto: UpdateUserAccountDto): Promise<UserAccount> {
    const account = await this.findOne(id);

    // Update basic fields
    if (updateUserAccountDto.email) account.email = updateUserAccountDto.email;
    if (updateUserAccountDto.passwordHash) account.passwordHash = updateUserAccountDto.passwordHash;
    if (updateUserAccountDto.userName) account.userName = updateUserAccountDto.userName;

    // Merge profile fields instead of replacing the entire object
    if (updateUserAccountDto.profile) {
      if (!account.profile) {
        account.profile = {} as any;
      }
      Object.assign(account.profile, updateUserAccountDto.profile);
    }

    return await this.userAccountRepository.save(account);
  }

  async remove(id: string): Promise<UserAccount> {
    const account = await this.findOne(id);
    return await this.userAccountRepository.remove(account);
  }

  async count(): Promise<number> {
        return this.userAccountRepository.count();
  }
}
