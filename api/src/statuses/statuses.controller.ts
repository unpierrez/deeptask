import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StatusesService } from './statuses.service';
import { CreateStatusDTO } from './dtos/create-status.dto';
import { UpdateStatusDTO } from './dtos/update-status.dto';
import { ReorderStatusesDTO } from './dtos/reorder-statuses.dto';

@Controller('statuses')
@UseGuards(JwtAuthGuard)
export class StatusesController {
  constructor(private statusesService: StatusesService) {}

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.statusesService.findAll(user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateStatusDTO,
  ) {
    return this.statusesService.create(user.userId, dto);
  }

  @Patch('reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  reorder(
    @CurrentUser() user: { userId: string },
    @Body() dto: ReorderStatusesDTO,
  ) {
    return this.statusesService.reorder(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateStatusDTO,
  ) {
    return this.statusesService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.statusesService.remove(user.userId, id);
  }
}
