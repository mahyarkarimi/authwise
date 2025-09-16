import { Body, Controller, Get, Post, Res, Req, Delete, Param, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuth2Authenticate, OAuth2Authorization, OAuth2Authorize, OAuth2RenewToken, OAuth2Token } from '@authwise/oauth2-server';
import { AuthorizationCode, Token } from '@node-oauth/oauth2-server';
import { of } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto';
import { GeneralResponse } from 'src/utils/general-response';
import { Request, Response } from 'express';

export class LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('authenticate')
  @OAuth2Authenticate()
  authenticateClient(@OAuth2Token() token: Token) {
    return of(token);
  }

  @OAuth2Authorize()
  @Get('authorize')
  authorizeClient(
    @OAuth2Authorization()
    authorization: AuthorizationCode,
    @Res() res
  ) {
    const { redirectUri, authorizationCode } = authorization;
    res.redirect(`${redirectUri}?code=${authorizationCode}`);
  }

  @Post('token')
  @OAuth2RenewToken()
  renewToken(@OAuth2Token() token: Token, @Res() res: Response) {
    res.cookie('token', token.accessToken, { httpOnly: true, sameSite: 'lax' });
    res.json({ token });
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    await this.authService.registerNewUser(body.username, body.password);
    return new GeneralResponse(true);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];

    await this.authService.logout(token!);
    return new GeneralResponse(true);
  }

  @Get('profile')
  @OAuth2Authenticate()
  async getProfile(@Req() req: Request, @OAuth2Token() token: Token) {
    return new GeneralResponse(true, { data: token.user });
  }

  @Post('change-password')
  @OAuth2Authenticate()
  async changePassword(@Body() body: { currentPassword: string; newPassword: string }, @Req() req: any, @Res() res: Response) {
    const userId = req.user.sub;
    const result = await this.authService.changePassword(userId, body.currentPassword, body.newPassword);
    if (result) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid current password' });
    }
  }

  @Get('/list-tokens')
  @OAuth2Authenticate()
  getTokens(@OAuth2Token() token: Token) {
    return this.authService.getUserTokens(token.userId, token.accessToken);
  }

  @Get('/list-authorization-codes')
  @OAuth2Authenticate()
  getAuthorizationCodes(@OAuth2Token() token: Token) {
    return this.authService.getUserAuthorizationCodes(token.userId);
  }

  @Delete('/tokens/:token')
  @OAuth2Authenticate()
  revokeToken(@OAuth2Token() token: Token, @Param('token') tokenToRemove: string) {
    if (token.accessToken === tokenToRemove) {
      throw new BadRequestException('Cannot revoke current access token, you need to logout instead');
    }
    return this.authService.revokeUserToken(token.userId, tokenToRemove);
  }

  @Delete('/authorization-codes/:code')
  @OAuth2Authenticate()
  revokeAuthorizationCode(@OAuth2Token() token: Token, @Param('code') authorizationCode: string) {
    return this.authService.revokeUserAuthorizationCode(token.userId, authorizationCode);
  }
}
