import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
    AuthorizationCode as RuntimeAuthorizationCode,
    AuthorizationCodeModel,
    Falsey,
    PasswordModel,
    RefreshToken,
    RefreshTokenModel,
    RequestAuthenticationModel,
    Token as AccessToken,
    Client as RuntimeClient,
    User as RuntimeUser,
} from '@node-oauth/oauth2-server';
import * as argon2 from 'argon2';
import * as crypto from 'node:crypto';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtOpts } from './utils/auth-config';
import { PrismaService } from './prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class OAuth2ModelService
    implements
    RequestAuthenticationModel,
    PasswordModel,
    RefreshTokenModel,
    AuthorizationCodeModel {

        private readonly logger = new Logger(OAuth2ModelService.name);
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
    ) { }

    private getAccessTokenOptions(): JwtSignOptions {
        this.logger.debug('getAccessTokenOptions')
        return {
            secret: this.configService.get('JWT_PRIVATE_KEY'),
            expiresIn: '3h',
            algorithm: jwtOpts.algorithm,
            issuer: jwtOpts.issuer,
            audience: jwtOpts.audience,
        };
    }

    private getRefreshTokenOptions(): JwtSignOptions {
        this.logger.debug('getRefreshTokenOptions')
        return {
            secret: this.configService.get('JWT_REFRESH_PRIVATE_KEY'),
            expiresIn: '3D',
            algorithm: jwtOpts.algorithm,
            issuer: jwtOpts.issuer,
            audience: jwtOpts.audience,
        };
    }

    private maskUser(user: RuntimeUser): RuntimeUser {
        const { password, ...maskedUser } = user;
        return maskedUser;
    }

    private maskClient(client: RuntimeClient): RuntimeClient {
        const { clientSecret, ...maskedClient } = client;
        return maskedClient;
    }

    async generateAuthorizationCode?(
        client: RuntimeClient,
        user: RuntimeUser,
        scope: string[],
    ): Promise<string> {
        this.logger.debug('generateAuthorizationCode');
        const inputString = `${client.clientId}${user.id}${user.username}${scope.join(',')}${Date.now()}${crypto.randomBytes(32).toString('hex')}`;
        return crypto.createHash('sha256').update(inputString).digest('hex').substring(0, 48);
    }

    async getAuthorizationCode(
        authorizationCode: string,
    ): Promise<RuntimeAuthorizationCode | Falsey> {
        this.logger.debug('getAuthorizationCode');
        const code = await this.prisma.authorizationCode.findUnique({
            where: { authorizationCode },
            include: { user: true, client: true },
        });
        if (!code) return false;

        return {
            authorizationCode: code.authorizationCode,
            expiresAt: code.expiresAt,
            redirectUri: code.redirectUri,
            scope: code.scope ?? [],
            client: this.maskClient(code.client),
            user: this.maskUser(code.user),
            codeChallenge: code.codeChallenge ?? undefined,
            codeChallengeMethod: code.codeChallengeMethod ?? undefined,
        };
    }

    async saveAuthorizationCode(
        code: Pick<
            RuntimeAuthorizationCode,
            'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope' | 'codeChallenge' | 'codeChallengeMethod'
        >,
        client: RuntimeClient,
        user: RuntimeUser,
    ): Promise<RuntimeAuthorizationCode | Falsey> {
        this.logger.debug('saveAuthorizationCode');
        const _code = await this.prisma.authorizationCode.create({
            data: {
                authorizationCode: code.authorizationCode,
                expiresAt: code.expiresAt,
                redirectUri: code.redirectUri,
                clientId: client.id,
                userId: user.id,
                codeChallenge: code.codeChallenge,
                codeChallengeMethod: code.codeChallengeMethod
            }
        });
        return {
            authorizationCode: _code.authorizationCode,
            expiresAt: _code.expiresAt,
            redirectUri: _code.redirectUri,
            scope: _code.scope ?? [],
            codeChallenge: _code.codeChallenge ?? undefined,
            codeChallengeMethod: _code.codeChallengeMethod ?? undefined,
            client: this.maskClient(client),
            user: this.maskUser(user),
        };
    }

    async revokeAuthorizationCode(
        code: RuntimeAuthorizationCode,
    ): Promise<boolean> {
        this.logger.debug('revokeAuthorizationCode');
        const _code = await this.prisma.authorizationCode.delete({ where: { authorizationCode: code.authorizationCode } });
        if (!_code) return false;
        return true;
    }

    async getRefreshToken(
        refreshToken: string,
    ): Promise<RefreshToken | Falsey> {
        this.logger.debug('getRefreshToken');
        const token = await this.prisma.token.findUnique({
            where: { refreshToken },
            include: { user: true, client: true },
        });

        if (!token || !token.refreshToken) return false;
        return {
            client: this.maskClient(token.client),
            user: this.maskUser(token.user),
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt ?? undefined,
            scope: token.scope
        };
    }

    async revokeToken(
        token: RefreshToken | AccessToken,
    ): Promise<boolean> {
        this.logger.debug('revokeToken');
        if (!token.refreshToken) return false;

        const _token = await this.prisma.token.delete({ where: { refreshToken: token.refreshToken } });
        if (!_token) {
            return false
        }
        return true;
    }

    async verifyScope(
        token: AccessToken,
        scope: string[],
    ): Promise<boolean> {
        this.logger.debug('verifyScope');
        if (!token.scope || token.scope.length === 0) {
            return scope.length === 0;
        }
        return scope.every(s => token.scope?.includes(s));
    }

    async generateRefreshToken(
        client: RuntimeClient,
        user: RuntimeUser,
        scope: string[],
    ): Promise<string> {
        this.logger.debug('generateRefreshToken');
        const token = await this.jwtService.signAsync({ id: user.id, scope, client: client.clientId }, this.getRefreshTokenOptions());
        return token;
    }

    async getUser(
        username: string,
        password: string,
    ): Promise<RuntimeUser | Falsey> {
        this.logger.debug('getUser');
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: { id: true, username: true, password: true },
        });
        if (user && (await argon2.verify(user.password, password))) {
            return this.maskUser(user);
        }
        return false;
    }

    async validateScope(
        user: RuntimeUser,
        client: RuntimeClient,
        scope?: string[],
    ): Promise<string[] | Falsey> {
        this.logger.debug('validateScope');
        // Define default scopes if none provided
        if (!scope || scope.length === 0) {
            return ['read']; // Example: default to 'read' scope
        }
        
        // Validate requested scopes against client's allowed scopes
        // Assuming client has an 'allowedScopes' property or derive from grants
        const allowedScopes = client.grants?.includes('authorization_code') ? ['read', 'write'] : ['read'];
        
        // Filter to only valid scopes
        const validScopes = scope.filter(s => allowedScopes.includes(s));
        
        // Return valid scopes or false if none are valid
        return validScopes.length > 0 ? validScopes : false;
    }

    async generateAccessToken(
        client: RuntimeClient,
        user: RuntimeUser,
        scope: string[],
    ): Promise<string> {
        this.logger.debug('generateAccessToken');
        const token = await this.jwtService.signAsync({ id: user.id, scope, client: client.clientId }, this.getAccessTokenOptions());
        return token;
    }

    async getClient(
        clientId: string,
        clientSecret: string,
    ): Promise<RuntimeClient | Falsey> {
        this.logger.debug('getClient');
        const client = await this.prisma.client.findUnique({
            where: {
                clientId,
                ...(clientSecret ? { clientSecret } : {})
            },
        });
        if (!client) return false;

        return {
            grants: client.grants,
            id: client.id,
            clientId: client.clientId,
            redirectUris: client.redirectUris,
            accessTokenLifetime: client.accessTokenLifetime,
            refreshTokenLifetime: client.refreshTokenLifetime,
        };
    }

    async saveToken(
        token: AccessToken,
        client: RuntimeClient,
        user: RuntimeUser,
    ): Promise<AccessToken | Falsey> {
        this.logger.debug('saveToken');
        const _token = await this.prisma.token.create({
            data: {
                accessToken: token.accessToken,
                accessTokenExpiresAt: token.accessTokenExpiresAt,
                refreshToken: token.refreshToken ?? undefined,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt ?? undefined,
                scope: token.scope,
                clientId: client.id,
                userId: user.id,
            }
        });
        return {
            accessToken: _token.accessToken,
            accessTokenExpiresAt: _token.accessTokenExpiresAt ?? undefined,
            refreshToken: _token.refreshToken ?? undefined,
            refreshTokenExpiresAt: _token.refreshTokenExpiresAt ?? undefined,
            scope: _token.scope,
            client: this.maskClient(client),
            user: this.maskUser(user),
        };
    }

    async getAccessToken(
        accessToken: string,
    ): Promise<AccessToken | Falsey> {
        this.logger.debug('getAccessToken');
        const token = await this.prisma.token.findUnique({
            where: { accessToken },
            include: { user: true, client: true },
        });
        if (!token) return false;
        return {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt ?? undefined,
            refreshToken: token.refreshToken ?? undefined,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt ?? undefined,
            scope: token.scope,
            client: {
                id: token.client.id,
                clientId: token.client.clientId,
                grants: token.client.grants,
                redirectUris: token.client.redirectUris,
            },
            user: this.maskUser(token.user),
        };
    }
}
