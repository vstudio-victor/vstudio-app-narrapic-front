import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from './config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private appConfig: AppConfig;

  constructor(@Inject(APP_CONFIG) appConfig: AppConfig) {
    this.appConfig = appConfig;
  }

  getAppConfig(): AppConfig {
    return this.appConfig;
  }
}
