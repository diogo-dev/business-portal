import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UserAccountService } from './user-account.service';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { Roles } from 'src/decorators/roles.decorator';
import type { UUID } from 'crypto';


@Controller('user-account')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserAccountDto: CreateUserAccountDto) {
    return this.userAccountService.create(createUserAccountDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.userAccountService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.userAccountService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updateUserAccountDto: UpdateUserAccountDto) {
    return this.userAccountService.update(id, updateUserAccountDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.userAccountService.remove(id);
  }
}
