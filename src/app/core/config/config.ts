import { InjectionToken } from '@angular/core';

export type Env = 'DZN' | 'INT' | 'PRE' | 'PRD' | 'ICT';

export interface AppConfig {
  env: Env;
  narraPicUrl: string;
  version: string;
  availableLang: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
