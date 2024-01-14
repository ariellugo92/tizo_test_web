import { HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { LocalStorageService } from '../services/local-storage.service';
import { inject } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

export function tokenInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem('token');

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`)
  });

  return next(newReq).pipe(
    catchError(err => {
      if (err.status === 401 || err.status === 403) {
        localStorageService.removeItem('token');
        window.location.href = '/auth/login';
      }
      return throwError(() => err);
    })
  );
}
