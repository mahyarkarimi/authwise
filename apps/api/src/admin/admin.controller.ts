import { Controller, Post, Body, Res, UnauthorizedException, BadRequestException, Get, UseGuards, Delete, Param, Put, Logger } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateClientDto, CreateUserDto } from './dto';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}
  @Post('login')
  async login(@Body() body: { email: string; password: string; totpCode?: string }) {
    const result = await this.adminService.login(body.email, body.password, body.totpCode);
    
    return result;
  }

  @Post('setup-totp')
  @UseGuards(JwtAuthGuard)
  async setupTotp(@Body() body: { adminId: string }) {
    try {
      const result = await this.adminService.setupTotp(body.adminId);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async listUsers(@Res() res: Response) {
    try {
      const users = await this.adminService.listUsers();
      return res.json({ users });
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  @Post('users')
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() body: CreateUserDto) {
    try {
      const user = await this.adminService.createUser(body.username, body.password);
      return { success: true, user };
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Body('id') id: string) {
    try {
      await this.adminService.deleteUser(id);
      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to delete user');
    }
  }

  @Get('clients')
  @UseGuards(JwtAuthGuard)
  async listClients() {
    try {
      const clients = await this.adminService.listClients();
      return { clients }
    } catch (error) {
      throw new BadRequestException('Failed to fetch clients');
    }
  }

  @Get('clients/:id')
  @UseGuards(JwtAuthGuard)
  async getClient(@Param('id') id: string) {
    try {
      const client = await this.adminService.getClient(id);
      return { success: true, client };
    } catch (error) {
      throw new BadRequestException('Failed to edit client');
    }
  }

  @Post('clients')
  @UseGuards(JwtAuthGuard)
  async createClient(@Body() body: CreateClientDto) {
    try {
      const user = await this.adminService.createClient(body);
      return { success: true, user };
    } catch (error) {
      this.logger.error(`Failed to create client, message:${error.message}`, error.stack);
      throw new BadRequestException('Failed to create client');
    }
  }

  @Put('clients/:id')
  @UseGuards(JwtAuthGuard)
  async editClient(@Param('id') id: string, @Body() body: Partial<CreateClientDto>) {
    try {
      const user = await this.adminService.editClient(id, body);
      return { success: true, user };
    } catch (error) {
      this.logger.error(`Failed to edit client with id ${id}, message: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to edit client');
    }
  }

  @Delete('clients/:id')
  @UseGuards(JwtAuthGuard)
  async deleteClient(@Body('id') id: string) {
    try {
      await this.adminService.deleteClient(id);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to delete client with id ${id}, message: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to delete client');
    }
  }
}