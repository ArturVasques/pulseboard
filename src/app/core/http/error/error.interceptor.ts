import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { mapHttpError } from '../error/map-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const appErr = mapHttpError(err);
        snack.open(appErr.message, 'OK', { duration: 3500 });
      } else {
        snack.open('Ocorreu um erro inesperado.', 'OK', { duration: 3500 });
      }
      return throwError(() => err);
    })
  );
};