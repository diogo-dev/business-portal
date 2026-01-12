import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAccountModule } from 'src/user-account/user-account.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Module({
  imports: [
    UserAccountModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<StringValue>('JWT_EXPIRES_IN', '1h') }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
