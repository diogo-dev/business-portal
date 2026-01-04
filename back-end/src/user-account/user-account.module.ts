import { Module } from '@nestjs/common';
import { UserAccountService } from './user-account.service';
import { UserAccountController } from './user-account.controller';
import { UserAccount } from './entities/user-account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount]), RoleModule],
  controllers: [UserAccountController],
  providers: [UserAccountService],
  exports: [UserAccountService]
})
export class UserAccountModule {}
