import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  find(@Query('walkthrough') walkthrough: string) {
    return this.reportService.find(walkthrough);
  }
}
