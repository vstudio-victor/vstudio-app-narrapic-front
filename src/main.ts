import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, importProvidersFrom, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { APP_CONFIG, AppConfig } from './app/core/config/config';
import { Configuration } from './app/core/data-services/narra-pic-api/configuration';
import { App } from './app/app';
import { ServicesModule } from './app/services/services.module';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';

async function loadConfig(): Promise<AppConfig> {
  try {
    const response = await fetch('/assets/config.json');
    return await response.json();
  } catch (err) {
    console.error('Failed to load config:', err);
    throw err;
  }
}

let appConfig: AppConfig;

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(ServicesModule),
    provideHttpClient(withInterceptors([authInterceptor]), withInterceptorsFromDi()),
    provideRouter(routes),
    provideAppInitializer(() =>
      loadConfig().then((config) => {
        appConfig = config;
      })
    ),
    {
      provide: APP_CONFIG,
      useFactory: () => appConfig,
    },
    {
      provide: Configuration,
      useFactory: () =>
        new Configuration({
          basePath: appConfig.narraPicUrl,
        }),
    },
  ],
}).catch((err) => console.error(err));
