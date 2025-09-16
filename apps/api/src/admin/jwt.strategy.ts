import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService, 
    private readonly prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('adminJwtPrivateKey') || 'default_admin_secret',
    });
  }

  async validate(payload: { sub: string }): Promise<{ id: string }> {
    const adminUser = await this.prisma.admin.findUnique({ where: { id: payload.sub } });
    if (!adminUser) {
      throw new UnauthorizedException();
    }
    return { 
        id: adminUser.id,
    };
  }
} 