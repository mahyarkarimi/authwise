import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PrismaModule,
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(config: ConfigService) {
                return {
                    secret: config.get<string>('ADMIN_JWT_SECRET') || 'admin-secret-key',
                    signOptions: { expiresIn: config.get<string>('ADMIN_JWT_EXPIRES_IN') || '2h' },
                }
            },
        }),
    ],
    controllers: [AdminController],
    providers: [AdminService, JwtAuthGuard, JwtStrategy],
})
export class AdminModule { }