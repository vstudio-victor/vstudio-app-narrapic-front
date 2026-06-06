import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  const authEndpoints = ['/login', '/signUp', '/refresh-token'];
  const isAuthEndpoint = authEndpoints.some((endpoint) => req.url.includes(endpoint));

  if (isAuthEndpoint) {
    return next(req);
  }

  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        const refreshToken = authService.getRefreshToken();

        if (refreshToken) {
          return authService.refreshAccessToken().pipe(
            switchMap(() => {
              const newAccessToken = authService.getAccessToken();
              if (newAccessToken) {
                const clonedRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                });
                return next(clonedRequest);
              }
              return throwError(() => error);
            }),
            catchError((refreshError) => {
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          authService.logout();
        }
      }

      return throwError(() => error);
    })
  );
};
