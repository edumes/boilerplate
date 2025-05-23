import { filters } from '@core/utils/report-filters.util';
import nunjucks from 'nunjucks';
import path from 'path';

const templatesPath = path.resolve(__dirname, '../core/utils/templates/report');
const outputPath = path.resolve(__dirname, '../../public/reports');

const defaultStyles = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '12px',
  lineHeight: '1.5',
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
};

const pageSettings = {
  format: 'A4',
  margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
};

export const reportConfig = { templatesPath, outputPath, defaultStyles, pageSettings };

const configureNunjucks = templatesDir => {
  const env = nunjucks.configure(templatesDir, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
  });

  Object.entries(filters).forEach(([name, filterFunc]) => {
    env.addFilter(name, filterFunc);
  });

  return env;
};

export const nunjucksEnv = configureNunjucks(templatesPath);
