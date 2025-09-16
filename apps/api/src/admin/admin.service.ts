import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as speakeasy from 'speakeasy';
import * as argon2 from 'argon2';
import { CreateClientDto } from './dto';
import _ from 'lodash';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  async login(email: string, password: string, totpCode?: string): Promise<{ token?: string; requiresTotp?: boolean; secret?: string }> {
    const admin = await this.prisma.admin.findUnique({ where: { email } });

    if (!admin || !await argon2.verify(admin.password, password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if TOTP is set up
    if (admin.totpSecret) {
      if (!totpCode) {
        return { requiresTotp: true };
      }

      const verified = speakeasy.totp.verify({
        secret: admin.totpSecret,
        encoding: 'base32',
        token: totpCode,
        window: 2,
      });

      if (!verified) {
        throw new UnauthorizedException('Invalid TOTP code');
      }
    }

    // Update last logged in
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoggedIn: new Date() },
    });

    const payload = { email: admin.email, sub: admin.id, type: 'admin' };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async setupTotp(adminId: string): Promise<{ secret: string; qrCodeUrl?: string }> {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new Error('Admin not found');

    const secret = speakeasy.generateSecret({
      name: `OAuth2 Server (${admin.email})`,
      issuer: 'OAuth2 Server',
    });

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { totpSecret: secret.base32 },
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
    };
  }

  async listUsers() {
    const records = await this.prisma.user.findMany();
    return records;
  }

  async createUser(username: string, password: string) {
    const hashedPassword = await argon2.hash(password);
    await this.prisma.user.create({
      data: { username, password: hashedPassword },
    });
    return true;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });
    if (!deletedUser) throw new NotFoundException('User not found');
    return true;
  }

  async listClients() {
    const records = await this.prisma.client.findMany();
    return records
  }

  async getClient(id: string) {
    const record = await this.prisma.client.findUnique({
      where: { id },
    });
    return record;
  }

  async createClient(body: CreateClientDto) {
    const record = await this.prisma.client.create({
      data: {
        clientId: this.generateRandomString(20, 2),
        clientSecret: this.generateRandomString(40, 3),
        redirectUris: body.redirectUris,
        accessTokenLifetime: body.accessTokenLifetime || 3600,
        refreshTokenLifetime: body.refreshTokenLifetime || 1209600,
        grants: body.grants || ['password', 'authorization_code', 'refresh_token'],
        scope: body.scopes || ['read', 'write'],
        name: body.name,
      },
    });
    return record;
  }

  async editClient(id: string, body: Partial<CreateClientDto>) {  
    const record = await this.prisma.client.update({
      where: { id },
      data: _.pickBy(body, _.identity),
    });
    return record;
  }


  async deleteClient(id: string) {
    const deleteRes = await this.prisma.client.delete({
      where: { id },
    });
    if (!deleteRes) throw new NotFoundException('Client not found');
    return true;
  }

  /**
 * Generates a random string.
 * @param length Number of characters in the string.
 * @param complexity 1 = numbers+lowercase, 2 = numbers+lowercase+uppercase, 3 = numbers+letters+symbols
 */
  generateRandomString(length: number, complexity: 1 | 2 | 3 = 3): string {
    let chars = '0123456789';
    chars += 'abcdefghijklmnopqrstuvwxyz';
    if (complexity >= 2) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (complexity >= 3) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}