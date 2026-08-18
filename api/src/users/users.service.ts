import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDTO } from '../me/dtos/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarColor: true,
        accountType: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findMe(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarColor: true,
        accountType: true,
        createdAt: true,
        updatedAt: true,
        preferences: true,
      },
    });

    if (!user) return null;

    return {
      ...user,
      preferences: user.preferences
        ? this.formatPreferences(user.preferences)
        : null,
    };
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDTO) {
    const prefs = await this.prisma.userPreferences.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
    return this.formatPreferences(prefs);
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async linkGoogleId(userId: string, googleId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { googleId },
    });
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async ensurePreferences(userId: string) {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  private formatPreferences(prefs: {
    accentColor: string;
    locale: string;
    notifyDueSoon: boolean;
    notifyHighPrio: boolean;
    notifyCompleted: boolean;
    notifyAchievement: boolean;
  }) {
    return {
      accentColor: prefs.accentColor,
      locale: prefs.locale,
      notifications: {
        dueSoon: prefs.notifyDueSoon,
        highPriority: prefs.notifyHighPrio,
        completed: prefs.notifyCompleted,
        achievement: prefs.notifyAchievement,
      },
    };
  }
}
