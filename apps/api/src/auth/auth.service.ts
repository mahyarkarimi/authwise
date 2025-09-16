import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async registerNewUser(username: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException("User exists");
    }
    const hashedPassword = await argon2.hash(password);
    const inserted = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return inserted;
  }

  async validateUser(id): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user) {
      return user;
    }
    return null;
  }

  async validateUserByCredentials(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  async logout(token: string) {
    await this.prisma.token.delete({ where: { accessToken: token } });
    return true;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user && (await argon2.verify(user.password, currentPassword))) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: await argon2.hash(newPassword) }
      });
      return true;
    }
    return false;
  }

  async getUserTokens(userId: string, currentAccessToken: string) {
    const records = await this.prisma.token.findMany({
      where: { userId },
      include: { client: { select: { id: true, name: true } } },
    });
    return { tokens: records.map(record => ({ ...record, isCurrentSession: record.accessToken === currentAccessToken })) };
  }

  async getUserAuthorizationCodes(userId: string) {
    const records = await this.prisma.authorizationCode.findMany({
      where: { userId },
    });
    return { codes: records };
  }

  async revokeUserAuthorizationCode(userId: string, code: string) {
    await this.prisma.authorizationCode.delete({
      where: { userId, authorizationCode: code },
    });
    return { success: true };
  }

  async revokeUserToken(userId: string, token: string) {
    const tokenRecord = await this.prisma.token.findFirst({
      where: {
        userId,
        OR: [{ accessToken: token }, { refreshToken: token }],
      },
    });
    if (tokenRecord) {
      await this.prisma.token.delete({
        where: { id: tokenRecord.id },
      });
    }
    return { success: true };
  }
}
