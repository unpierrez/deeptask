import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }

    @Get()
    findAll(@CurrentUser() user: { userId: string }) {
        return this.notificationsService.findAll(user.userId);
    }

    @Post('read-all')
    @HttpCode(HttpStatus.NO_CONTENT)
    markAllRead(@CurrentUser() user: { userId: string }) {
        return this.notificationsService.markAllRead(user.userId);
    }

    @Patch(':id/read')
    @HttpCode(HttpStatus.NO_CONTENT)
    markRead(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
        return this.notificationsService.markRead(user.userId, id);
    }
}
