import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Token } from '../services/token';
import { FirebaseAuthService } from '../services/firebase-auth';

export const authGuard: CanActivateFn = (route, state) => {
  const token = inject(Token);
  const router = inject(Router);
  const auth = inject(FirebaseAuthService);
  const platformId = inject(PLATFORM_ID);

  // Si estamos en SSR, hacemos un fallback síncrono al Token local
  if (!isPlatformBrowser(platformId)) {
    if (token.hasToken()) return true;
    router.navigateByUrl('/auth/login');
    return false;
  }

  // En el cliente, chequeamos el estado de Firebase (asincrónico)
  // If we already have a token stored locally, allow navigation immediately.
  if (token.hasToken()) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    let sub: any;
    sub = auth.authState$.subscribe(user => {
      // Wait until auth state emits a value other than the initial null.
      if (user) {
        sub.unsubscribe();
        resolve(true);
        return;
      }
      // if user is null, that means not authenticated
      sub.unsubscribe();
      router.navigateByUrl('/auth/login');
      resolve(false);
    });
  });
};
