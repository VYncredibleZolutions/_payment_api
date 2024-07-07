import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './basic-auth.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, PassportModule],
  providers: [AuthService, BasicStrategy],
})
export class AuthModule {}
