import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { Token } from '../services/token';

export const authGuard: CanActivateFn = (route, state) => {
  const token = inject(Token);
  const router = inject(Router);
  
  if (token.hasToken()) {
    return true;
  }
  
  router.navigateByUrl('/auth/login');
  return false;
};
