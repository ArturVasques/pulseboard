import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiPrefixInterceptor } from './core/http/interceptors/api-prefix.interceptor';
import { authInterceptor } from './core/http/interceptors/auth.interceptor';
import { retryInterceptor } from './core/http/interceptors/retry.interceptor';
import { errorInterceptor } from './core/http/error/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations (),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiPrefixInterceptor, authInterceptor, retryInterceptor, errorInterceptor])
    ),
  ]
};
