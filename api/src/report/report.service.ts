import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getReport(userId: string) {
    const [statuses, tasks] = await Promise.all([
      this.prisma.status.findMany({
        where: { userId },
        orderBy: { position: 'asc' },
      }),
      this.prisma.task.findMany({
        where: { userId },
        include: { tags: true },
      }),
    ]);

    const doneStatusIds = new Set(
      statuses.filter((s) => s.isDone).map((s) => s.id),
    );

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const total = tasks.length;
    const doneCount = tasks.filter((t) => doneStatusIds.has(t.statusId)).length;
    const openCount = total - doneCount;
    const donePct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    const highCount = tasks.filter(
      (t) => !doneStatusIds.has(t.statusId) && t.priority === 'alta',
    ).length;
    const doneToday = tasks.filter(
      (t) =>
        t.completedAt !== null &&
        t.completedAt >= todayStart &&
        t.completedAt <= todayEnd,
    ).length;

    const byStatus = statuses.map((s) => ({
      id: s.id,
      title: s.title,
      color: s.color,
      count: tasks.filter((t) => t.statusId === s.id).length,
    }));

    const priorities = ['alta', 'media', 'baixa'] as const;
    const byPriority = priorities.map((p) => ({
      priority: p,
      count: tasks.filter((t) => t.priority === p).length,
    }));

    const tagCounts = new Map<string, number>();
    for (const task of tasks) {
      for (const tag of task.tags) {
        tagCounts.set(tag.label, (tagCounts.get(tag.label) ?? 0) + 1);
      }
    }
    const byTag = [...tagCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    return {
      kpis: { total, doneCount, openCount, donePct, highCount, doneToday },
      byStatus,
      byPriority,
      byTag,
    };
  }
}
