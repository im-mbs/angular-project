import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authToken = localStorage.getItem('auth_token');

  if (authToken) {
    router.navigate(['/home']);
    return false;
  }

  return true; // اجازه ورود به login
};

