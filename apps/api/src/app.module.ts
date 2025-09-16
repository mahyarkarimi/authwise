import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { OAuth2ServerModule } from '@authwise/oauth2-server';
import { OAuth2ModelService } from './oauth2-model';
import { JwtModule } from '@nestjs/jwt';
import { AuthCookieMiddleware } from './utils/auth-cookie.middleware';
import loadKeysConfig from './load-keys.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
      load: [loadKeysConfig]
    }),
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        // Basic configuration - specific options will be provided per-use
        signOptions: {
          expiresIn: '3h',
        },
      }),
    }),
    AuthModule,
    AdminModule,
    OAuth2ServerModule.forRoot({
      modelClass: OAuth2ModelService,
    }),
  ],
  controllers: [AppController],
  providers: [OAuth2ModelService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthCookieMiddleware)
      .exclude('/api/auth/token')
      .forRoutes('*');
  }
}
