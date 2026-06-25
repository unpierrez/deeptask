import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReportService } from './report.service';

@Controller('report')
@UseGuards(JwtAuthGuard)
export class ReportController {
    constructor(private reportService: ReportService) { }

    @Get()
    getReport(@CurrentUser() user: { userId: string }) {
        return this.reportService.getReport(user.userId);
    }
}
