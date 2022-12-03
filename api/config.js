import { readFileSync } from 'fs';
import YAML from 'yaml';

import { deepFreeze } from './utils.js';

const defaultFile = 'default.yml';

const file = readFileSync(defaultFile, 'utf8');
const yml = YAML.parse(file);
const config = deepFreeze(yml);

export default config;
