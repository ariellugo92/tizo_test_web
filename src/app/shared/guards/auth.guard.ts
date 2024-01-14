import { CanActivateFn } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { inject } from '@angular/core';

export function authGuard(): CanActivateFn {
  return () => {
    const localStorageService = inject(LocalStorageService);
    const token = localStorageService.getItem('token');

    if (token) return true;

    window.location.href = '/auth/login';
    return false;
  }
};
