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
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { ReorderTasksDTO } from './dtos/reorder-tasks.dto';
import { QueryTasksDTO } from './dtos/query-tasks.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(
    @CurrentUser() user: { userId: string },
    @Query() query: QueryTasksDTO,
  ) {
    return this.tasksService.findAll(user.userId, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateTaskDTO) {
    return this.tasksService.create(user.userId, dto);
  }

  @Patch('reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  reorder(
    @CurrentUser() user: { userId: string },
    @Body() dto: ReorderTasksDTO,
  ) {
    return this.tasksService.reorder(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateTaskDTO,
  ) {
    return this.tasksService.update(user.userId, id, dto);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  complete(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.tasksService.complete(user.userId, id);
  }

  @Post(':id/reopen')
  @HttpCode(HttpStatus.OK)
  reopen(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.tasksService.reopen(user.userId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.tasksService.remove(user.userId, id);
  }
}
