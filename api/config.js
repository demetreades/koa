import { readFileSync } from 'fs';
import YAML from 'yaml';

const defaultFile = 'default.yml';

const file = readFileSync(defaultFile, 'utf8');
const yml = YAML.parse(file);
const config = Object.freeze(yml);

export default config;
