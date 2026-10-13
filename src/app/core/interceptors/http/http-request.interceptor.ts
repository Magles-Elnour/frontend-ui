import { HttpInterceptorFn } from '@angular/common/http';

var apiUrl: string = 'https://64-226-74-211.nip.io';
export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req.url);

  if (req.url.includes('api/')) {
    const authReq = req.clone({
      url: apiUrl + req.url,
    });
    return next(authReq);
  } else {
    return next(req);
  }
};
