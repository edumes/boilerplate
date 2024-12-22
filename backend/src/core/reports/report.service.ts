import { nunjucksEnv, reportConfig } from '@config/report.config';
import { logger } from '@core/utils/logger';
import { IBaseModel } from '@modules/base/base.model';
import { BaseService } from '@modules/base/base.service';
import dayjs from 'dayjs';
import fs, { mkdir, writeFile } from 'fs/promises';
import * as htmlPdf from 'html-pdf-node';
import nunjucks from 'nunjucks';
import path from 'path';
import * as XLSX from 'xlsx';

export interface ReportOptions {
  title?: string;
  template?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  orientation?: 'portrait' | 'landscape';
  customData?: Record<string, any>;
  data?: any;
  filename?: string;
  watermark?: string;
  header?: {
    height?: string;
    contents?: string;
  };
  footer?: {
    height?: string;
    contents?: string;
  };
  format?: 'pdf' | 'excel';
}

export class ReportService {
  private static instance: ReportService;
  private nunjucksEnv: nunjucks.Environment;

  private constructor() {
    this.nunjucksEnv = nunjucksEnv;
  }

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  static async generateReport<T extends IBaseModel>(
    service: BaseService<T>,
    options: ReportOptions = {},
  ): Promise<string> {
    try {
      const [items, total] = await service.findAll({
        ...options.filters,
        limit: 1000,
      });

      if (options.format === 'excel') {
        return this.generateExcel(items, service.getModelName(), service.getFields());
      }

      const templateData = {
        title: options.title || `${service.getModelName()} Report`,
        date: dayjs().format('DD/MM/YYYY HH:mm'),
        items,
        total,
        fields: service.getFields(),
        ...options.customData,
      };

      const templateName = options.template || 'default-report.njk';
      const templatePath = path.join(reportConfig.templatesPath, templateName);

      const html = nunjucks.render(templatePath, templateData);

      const pdfOptions = {
        format: 'A4',
        margin: reportConfig.pageSettings.margin,
        landscape: options.orientation === 'landscape',
        printBackground: true,
        preferCSSPageSize: true,
      };

      const buffer = await htmlPdf.generatePdf({ content: html }, pdfOptions);

      await mkdir(reportConfig.outputPath, { recursive: true });

      const fileName = `${service.getModelName()}_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`;
      const filePath = path.join(reportConfig.outputPath, fileName);
      await writeFile(filePath, buffer);

      logger.info(`Report generated successfully: ${fileName}`);
      return filePath;
    } catch (error) {
      logger.error('Error generating report', { error });
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }

  private static async generateExcel<T>(
    data: T[],
    modelName: string,
    fields: Record<string, any>,
  ): Promise<string> {
    try {
      const formattedData = data.map(item => {
        const formattedItem = {};
        Object.entries(fields).forEach(([key, field]) => {
          if (field.label) {
            formattedItem[field.label] = item[key];
          }
        });
        return formattedItem;
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      const colWidths = {};
      Object.entries(fields).forEach(([_, field], index) => {
        if (field.label && field.width) {
          colWidths[XLSX.utils.encode_col(index)] = field.width * 4;
        }
      });
      worksheet['!cols'] = Object.keys(formattedData[0] || {}).map((_, index) => ({
        wch: colWidths[XLSX.utils.encode_col(index)] || 10,
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

      await mkdir(reportConfig.outputPath, { recursive: true });

      const fileName = `${modelName}_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
      const filePath = path.join(reportConfig.outputPath, fileName);

      XLSX.writeFile(workbook, filePath);

      logger.info(`Excel report generated successfully: ${fileName}`);
      return filePath;
    } catch (error) {
      logger.error('Error generating Excel report', { error });
      throw new Error(`Failed to generate Excel report: ${error.message}`);
    }
  }

  async generatePDF(options: ReportOptions): Promise<string> {
    try {
      const html = await this.renderTemplate(options);

      const pdfOptions = {
        format: 'A4',
        margin: reportConfig.pageSettings.margin,
        landscape: options.orientation === 'landscape',
        headerTemplate: options.header?.contents,
        footerTemplate: options.footer?.contents,
        displayHeaderFooter: !!(options.header || options.footer),
        printBackground: true,
      };

      const buffer = await htmlPdf.generatePdf({ content: html }, pdfOptions);

      const outputPath = path.join(reportConfig.outputPath, options.filename);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, buffer);

      logger.info(`Report generated successfully: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error(error);
      logger.error('Error generating report', { error, options });
      throw new Error('Failed to generate report');
    }
  }

  private async renderTemplate(options: ReportOptions): Promise<string> {
    const templatePath = `${options.template}.njk`;
    const baseTemplate = await fs.readFile(
      path.join(reportConfig.templatesPath, 'base.njk'),
      'utf-8',
    );

    const content = this.nunjucksEnv.render(templatePath, {
      ...options.data,
      watermark: options.watermark,
      styles: reportConfig.defaultStyles,
    });

    return this.nunjucksEnv.renderString(baseTemplate, {
      content,
      header: options.header,
      footer: options.footer,
    });
  }
}

export const reportService = ReportService.getInstance();
