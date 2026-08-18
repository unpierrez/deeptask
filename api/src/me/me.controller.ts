import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { UpdatePreferencesDTO } from './dtos/update-preferences.dto';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(private usersService: UsersService) {}

  @Get()
  getMe(@CurrentUser() user: { userId: string }) {
    return this.usersService.findMe(user.userId);
  }

  @Patch('preferences')
  @HttpCode(HttpStatus.OK)
  updatePreferences(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdatePreferencesDTO,
  ) {
    return this.usersService.updatePreferences(user.userId, dto);
  }
}
