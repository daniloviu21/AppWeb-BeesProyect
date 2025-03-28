// interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const usuariosService = inject(UsuariosService);
  const router = inject(Router);

  // Obtener el token del servicio
  const token = usuariosService.getToken();

  // Clonar la petición y añadir el token si existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Manejar la petición y capturar errores
  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        // Token inválido o expirado - redirigir a login
        usuariosService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};