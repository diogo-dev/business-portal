import { Injectable } from '@nestjs/common';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccount } from './entities/user-account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAccountService {

  constructor(@InjectRepository(UserAccount) private readonly userAccountRepository: Repository<UserAccount>) {}

  async create(createUserAccountDto: CreateUserAccountDto) {
    const account = this.userAccountRepository.create(createUserAccountDto);
    return await this.userAccountRepository.save(account);
  }

  async findAll(): Promise<UserAccount[]> {
    return await this.userAccountRepository.find();
  }

  async findOne(id: string): Promise<UserAccount> {
    return await this.userAccountRepository.findOneOrFail({ where: { id } , relations: ['posts', 'events'] })
  }

  async update(id: string, updateUserAccountDto: UpdateUserAccountDto): Promise<UserAccount> {
    const account = await this.findOne(id);
    return await this.userAccountRepository.save({ ...account, ...updateUserAccountDto })
  }

  async remove(id: string): Promise<UserAccount> {
    const account = await this.findOne(id);
    return await this.userAccountRepository.remove(account);
  }
}
