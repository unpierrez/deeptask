import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { SignUpDTO } from './dtos/signup.dto';
import { SignInDTO } from './dtos/signin.dto';

const BCRYPT_SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    async signup(dto: SignUpDTO) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) throw new ConflictException('Email já em uso');

        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
        const user = await this.usersService.create({ name: dto.name, email: dto.email, passwordHash });

        await this.usersService.ensurePreferences(user.id);

        return this.issueTokens(user.id, user.email);
    }

    async signin(dto: SignInDTO) {
        const user = await this.usersService.findByEmail(dto.email);
        const hash = user?.passwordHash ?? '$2b$12$invalidhashpaddingtoforcework.Yx';
        const valid = await bcrypt.compare(dto.password, hash);

        if (!user || !valid) throw new UnauthorizedException('Credenciais inválidas');

        return this.issueTokens(user.id, user.email);
    }

    async refresh(userId: string, email: string, oldTokenHash: string) {
        await this.prisma.refreshToken.deleteMany({ where: { tokenHash: oldTokenHash } });
        return this.issueTokens(userId, email);
    }

    async signout(userId: string) {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }

    async googleSignin(credential: string) {
        let payload: { sub: string; email: string; name: string } | undefined;
        try {
            const clientId = this.config.getOrThrow<string>('GOOGLE_CLIENT_ID');
            const client = new OAuth2Client(clientId);
            const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
            const p = ticket.getPayload();
            if (!p?.sub || !p?.email) throw new Error('Missing sub or email in token payload');
            payload = { sub: p.sub, email: p.email, name: p.name ?? p.email };
        } catch (err) {
            console.error('[googleSignin] token verification failed:', err);
            throw new UnauthorizedException('Token do Google inválido');
        }

        const { sub: googleId, email, name } = payload;

        let user = await this.usersService.findByGoogleId(googleId);

        if (!user) {
            const existing = await this.usersService.findByEmail(email);
            if (existing) {
                user = await this.usersService.linkGoogleId(existing.id, googleId);
            } else {
                user = await this.usersService.create({ name, email, googleId });
                await this.usersService.ensurePreferences(user.id);
            }
        }

        return this.issueTokens(user.id, user.email);
    }

    private async issueTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.getOrThrow<string>('JWT_SECRET'),
                expiresIn: ACCESS_TOKEN_EXPIRY,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
                expiresIn: REFRESH_TOKEN_EXPIRY,
            }),
        ]);

        const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

        await this.prisma.refreshToken.create({ data: { tokenHash, userId, expiresAt } });

        return { accessToken, refreshToken };
    }
}
