import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { storageKeys } from '../../config/storage-keys';
import { ToastService } from '../../services/toast';

export const authInterceptor: HttpInterceptorFn = (originalRequest, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const accesstoken = authService.getAccessToken();
  const toast = inject(ToastService);
  let currentRequest = originalRequest;
  if (accesstoken) {
    currentRequest = originalRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });
  }
  return next(currentRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        toast.error('شما مجوز انجام این عملیات را ندارید! ⛔️');
      }
      if (
        error.status === 401 ||
        (error.status === 500 && error.error.message === 'invalid token')
      ) {
        if (authService.isRefreshing) {
          return authService.accessTokenTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((newToken) => {
              return next(
                originalRequest.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                })
              );
            })
          );
        } else {
          authService.isRefreshing = true;
          authService.accessTokenTokenSubject.next(null);
          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              authService.isRefreshing = false;
              authService.accessTokenTokenSubject.next(response.accessToken);
              const retriedReq = originalRequest.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              });
              return next(retriedReq);
            }),
            catchError((refreshError) => {
              console.log('رفرش شکست خورد خدافظظظ');
              authService.isRefreshing = false;
              // localStorage.removeItem('accessToken');
              // sessionStorage.removeItem('refreshToken');
              //router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
