import { addAliases } from 'module-alias';
import { resolve } from 'path';

addAliases({
  '@config': resolve(__dirname, '../config'),
  '@modules': resolve(__dirname, '../modules'),
  '@utils': resolve(__dirname, '../utils'),
  '@tests': resolve(__dirname, '../tests'),
});
