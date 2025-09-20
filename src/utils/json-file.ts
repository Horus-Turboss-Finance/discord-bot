import fs from 'fs';
import { HashSet } from '../types/monitor';
import { BaselineData, ErrorData } from '../services/hash-data.service';

export function loadJson<T = Record<string, HashSet|number>>(filePath: string): T {
  if (!fs.existsSync(filePath)) return {} as T;
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export function saveJson(filePath: string, data: BaselineData|ErrorData): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}