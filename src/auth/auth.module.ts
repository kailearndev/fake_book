import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthGuard],
  imports: [
    PassportModule,
    // Sử dụng registerAsync để chờ ConfigService sẵn sàng
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule để dùng được ConfigService
      inject: [ConfigService], // Tiêm ConfigService vào
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'CEO_fake_book_secret_key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any || '1d',
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule { }