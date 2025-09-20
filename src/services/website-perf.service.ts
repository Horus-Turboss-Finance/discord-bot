import fs from 'fs';
import path from 'path';
import { ChangeDetails } from '../types/monitor';
import * as WEBSITE_LINKS from '../config/websites.links';

type UrlErrorMap = Map<string, { time: string; url: string }[]>;

export class WebsitePerfService {
  private errorData: UrlErrorMap = new Map();
  private averagePing = new Map<string, number>();
  private errorPages = new Map<string, string[]>();
  private changedPages = new Map<string, ChangeDetails>();

  constructor() {
    const errorFilePath = path.join('log', 'error-data.json');
    const existingErrors = fs.existsSync(errorFilePath) ? JSON.parse(fs.readFileSync(errorFilePath, 'utf-8')) : {};

    for (const type in WEBSITE_LINKS) {
      this.errorData.set(
        type,
        Object.keys(existingErrors)
          .filter((url) => WEBSITE_LINKS[type as keyof typeof WEBSITE_LINKS].includes(url))
          .map((url) => ({ url, time: existingErrors[url] }))
      );
    }
  }
  
  updateChangedPages = (t: string, u: ChangeDetails) => this.changedPages.set(t, u);
  updateErrorPages = (t: string, u: string[]) => this.errorPages.set(t, u);
  updateAveragePing = (t: string, p: number) => this.averagePing.set(t, p);
  getErrors = () => this.errorData;
  getPings = () => this.averagePing;
  getErrorPages = () => this.errorPages;
  getChangedPages = () => this.changedPages;
}

export const websitePerfService = new WebsitePerfService();