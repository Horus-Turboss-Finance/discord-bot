import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { loadJson, saveJson } from '../utils/json-file';
import type { HashSet } from '../types/monitor';

const LOG_DIR = path.resolve(__dirname, '../../log');
const BASELINE_FILE = path.join(LOG_DIR, 'hash-data.json');
const ERROR_FILE = path.join(LOG_DIR, 'error-data.json');

export type BaselineData = Record<string, HashSet>;
export type ErrorData = Record<string, number>;

function ensureLogDirExists(): void {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR);
  }
}

export function loadBaselineData(): BaselineData {
  ensureLogDirExists();
  return loadJson<BaselineData>(BASELINE_FILE) ?? {};
}

export function saveBaselineData(data: BaselineData): void {
  ensureLogDirExists();
  saveJson(BASELINE_FILE, data);
}

export function loadErrorData(): ErrorData {
  ensureLogDirExists();
  return loadJson<ErrorData>(ERROR_FILE) ?? {};
}

export function saveErrorData(data: ErrorData): void {
  ensureLogDirExists();
  saveJson(ERROR_FILE, data);
}