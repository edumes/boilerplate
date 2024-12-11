import { addAliases } from 'module-alias';
import { resolve } from 'path';

addAliases({
  '@core': resolve(__dirname, '../core'),
  '@config': resolve(__dirname, '../config'),
  '@modules': resolve(__dirname, '../modules'),
  '@tests': resolve(__dirname, '../tests'),
});
