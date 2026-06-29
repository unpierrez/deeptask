import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { ReorderTasksDTO } from './dtos/reorder-tasks.dto';
import { QueryTasksDTO } from './dtos/query-tasks.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: string, query: QueryTasksDTO) {
        const statuses = await this.prisma.status.findMany({ where: { userId } });
        const doneStatusIds = statuses.filter((s) => s.isDone).map((s) => s.id);

        const where: Record<string, unknown> = { userId };

        if (query.filter === 'done') {
            where['statusId'] = { in: doneStatusIds };
        } else if (query.filter === 'active') {
            where['statusId'] = { notIn: doneStatusIds };
        }

        if (query.status) {
            where['statusId'] = query.status;
        }

        if (query.priority) {
            where['priority'] = query.priority;
        }

        if (query.q) {
            where['OR'] = [
                { title: { contains: query.q, mode: 'insensitive' } },
                { tags: { some: { label: { contains: query.q, mode: 'insensitive' } } } },
            ];
        }

        const tasks = await this.prisma.task.findMany({
            where,
            include: { tags: true },
            orderBy: { position: 'asc' },
        });

        return tasks.map(this.formatTask);
    }

    async create(userId: string, dto: CreateTaskDTO) {
        await this.prisma.task.updateMany({
            where: { userId, statusId: dto.statusId },
            data: { position: { increment: 1 } },
        });

        const task = await this.prisma.task.create({
            data: {
                userId,
                statusId: dto.statusId,
                title: dto.title,
                description: dto.description ?? null,
                priority: dto.priority ?? 'media',
                dueDate: dto.dueDate ?? null,
                position: 0,
                tags: dto.tags?.length
                    ? { create: dto.tags.map((label) => ({ label })) }
                    : undefined,
            },
            include: { tags: true },
        });

        return this.formatTask(task);
    }

    async update(userId: string, id: string, dto: UpdateTaskDTO) {
        await this.ensureOwnership(userId, id);

        const data: Record<string, unknown> = {};
        if (dto.title !== undefined) data['title'] = dto.title;
        if (dto.statusId !== undefined) data['statusId'] = dto.statusId;
        if (dto.priority !== undefined) data['priority'] = dto.priority;
        if ('dueDate' in dto) data['dueDate'] = dto.dueDate ?? null;
        if ('description' in dto) data['description'] = dto.description ?? null;

        if (dto.tags !== undefined) {
            await this.prisma.taskTag.deleteMany({ where: { taskId: id } });
            if (dto.tags.length) {
                await this.prisma.taskTag.createMany({
                    data: dto.tags.map((label) => ({ taskId: id, label })),
                });
            }
        }

        const task = await this.prisma.task.update({
            where: { id },
            data,
            include: { tags: true },
        });

        return this.formatTask(task);
    }

    async complete(userId: string, id: string) {
        const task = await this.ensureOwnership(userId, id);

        const doneStatus = await this.prisma.status.findFirst({
            where: { userId, isDone: true },
        });

        if (!doneStatus) throw new NotFoundException('Nenhum status de conclusão configurado');

        const updated = await this.prisma.task.update({
            where: { id },
            data: {
                prevStatusId: task.statusId,
                statusId: doneStatus.id,
                completedAt: new Date(),
            },
            include: { tags: true },
        });

        return this.formatTask(updated);
    }

    async reopen(userId: string, id: string) {
        const task = await this.ensureOwnership(userId, id);

        let targetStatusId = task.prevStatusId;

        if (!targetStatusId) {
            const first = await this.prisma.status.findFirst({
                where: { userId, isDone: false },
                orderBy: { position: 'asc' },
            });
            targetStatusId = first?.id ?? task.statusId;
        }

        const updated = await this.prisma.task.update({
            where: { id },
            data: {
                statusId: targetStatusId,
                prevStatusId: null,
                completedAt: null,
            },
            include: { tags: true },
        });

        return this.formatTask(updated);
    }

    async remove(userId: string, id: string) {
        await this.ensureOwnership(userId, id);
        await this.prisma.task.delete({ where: { id } });
    }

    async reorder(userId: string, dto: ReorderTasksDTO) {
        await Promise.all(
            dto.items.map((item) =>
                this.prisma.task.updateMany({
                    where: { id: item.id, userId },
                    data: { statusId: item.statusId, position: item.position },
                }),
            ),
        );
    }

    private async ensureOwnership(userId: string, id: string) {
        const task = await this.prisma.task.findFirst({ where: { id, userId } });
        if (!task) throw new NotFoundException('Tarefa não encontrada');
        return task;
    }

    private formatTask(task: {
        id: string;
        title: string;
        description: string | null;
        statusId: string;
        prevStatusId: string | null;
        priority: string;
        dueDate: string | null;
        position: number;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        tags: { label: string }[];
    }) {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            statusId: task.statusId,
            prevStatusId: task.prevStatusId,
            priority: task.priority,
            dueDate: task.dueDate,
            position: task.position,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            completedAt: task.completedAt?.toISOString() ?? null,
            tags: task.tags.map((t) => t.label),
        };
    }
}
