import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { timer, throwError } from 'rxjs';
import { mergeMap, retryWhen, scan } from 'rxjs/operators';
import { backoffDelay, isRetryableStatus } from '../retry/retry.util';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retryWhen((errors) =>
      errors.pipe(
        scan((acc, err: unknown) => {
          const e = err as HttpErrorResponse;
          const attempt = acc + 1;

          if (!isRetryableStatus(e.status) || attempt > 3) {
            throw err;
          }
          return attempt;
        }, 0),
        mergeMap((attempt) => timer(backoffDelay(attempt)))
      )
    ),
    // if it still fails
    // eslint-disable-next-line rxjs/no-unsafe-catch
    // (we're letting it bubble)
    // catchError is handled by errorInterceptor
  );
};