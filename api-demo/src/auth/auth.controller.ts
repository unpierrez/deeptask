import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dtos/signup.dto';
import { SignInDTO } from './dtos/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@Controller('auth')
@Throttle({ default: { limit: 5, ttl: 60000 } })
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() body: SignUpDTO) {
        return this.authService.signup(body);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() body: SignInDTO) {
        return this.authService.signin(body);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getCurrentUser(@CurrentUser() user: { userId: string }) {
        return this.usersService.findById(user.userId);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtRefreshGuard)
    refresh(@CurrentUser() user: { userId: string; email: string; tokenHash: string }) {
        return this.authService.refresh(user.userId, user.email, user.tokenHash);
    }

    @Post('signout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    signout(@CurrentUser() user: { userId: string }) {
        return this.authService.signout(user.userId);
    }
}

