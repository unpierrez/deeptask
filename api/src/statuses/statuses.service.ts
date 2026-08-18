import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStatusDTO } from './dtos/create-status.dto';
import { UpdateStatusDTO } from './dtos/update-status.dto';
import { ReorderStatusesDTO } from './dtos/reorder-statuses.dto';

@Injectable()
export class StatusesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.status.findMany({
      where: { userId },
      orderBy: { position: 'asc' },
    });
  }

  async create(userId: string, dto: CreateStatusDTO) {
    const maxPos = await this.prisma.status.aggregate({
      where: { userId },
      _max: { position: true },
    });

    const position = (maxPos._max.position ?? -1) + 1;

    if (dto.isDone) {
      await this.clearDoneStatus(userId);
    }

    return this.prisma.status.create({
      data: {
        userId,
        title: dto.title,
        color: dto.color,
        isDone: dto.isDone ?? false,
        position,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateStatusDTO) {
    await this.ensureOwnership(userId, id);

    if (dto.isDone) {
      await this.clearDoneStatus(userId, id);
    }

    return this.prisma.status.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const count = await this.prisma.status.count({ where: { userId } });
    if (count <= 1) {
      throw new BadRequestException(
        'Não é possível excluir o único status existente',
      );
    }

    await this.ensureOwnership(userId, id);

    const remaining = await this.prisma.status.findFirst({
      where: { userId, id: { not: id } },
      orderBy: { position: 'asc' },
    });

    await this.prisma.$transaction([
      this.prisma.task.updateMany({
        where: { userId, statusId: id },
        data: { statusId: remaining!.id },
      }),
      this.prisma.status.delete({ where: { id } }),
    ]);
  }

  async reorder(userId: string, dto: ReorderStatusesDTO) {
    await Promise.all(
      dto.items.map((item) =>
        this.prisma.status.updateMany({
          where: { id: item.id, userId },
          data: { position: item.position },
        }),
      ),
    );
  }

  private async ensureOwnership(userId: string, id: string) {
    const status = await this.prisma.status.findFirst({
      where: { id, userId },
    });
    if (!status) throw new NotFoundException('Status não encontrado');
    return status;
  }

  private async clearDoneStatus(userId: string, excludeId?: string) {
    await this.prisma.status.updateMany({
      where: {
        userId,
        isDone: true,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      data: { isDone: false },
    });
  }
}
