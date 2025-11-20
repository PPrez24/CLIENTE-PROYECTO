import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Token } from '../services/token';

export const guestGuard: CanActivateFn = (route, state) => {
  const token = inject(Token);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (token.hasToken()) {
    router.navigateByUrl('/app/dashboard');
    return false;
  }

  return true;
};
