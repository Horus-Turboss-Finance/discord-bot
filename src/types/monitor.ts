export interface HashSet {
  html: string;
  css: string;
  js: string;
  img: string;
}

export interface ChangeDetails {
  html: boolean;
  css: boolean;
  js: boolean;
  img: boolean;
}

export interface ChangePageItem {
  url: string;
  change: ChangeDetails;
}

export interface CaptureCompareResult {
  changePage: ChangePageItem[];
  errorPage: string[];
  averagePing: number;
}