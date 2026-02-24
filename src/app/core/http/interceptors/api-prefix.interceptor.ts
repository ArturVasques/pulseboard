import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http')) return next(req);
  const url = `${environment.apiBaseUrl}${req.url}`;
  return next(req.clone({ url }));
};