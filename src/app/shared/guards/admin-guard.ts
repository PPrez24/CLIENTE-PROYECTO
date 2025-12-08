import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { RolesService } from '../services/roles.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const roles = inject(RolesService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  if (roles.isAdminSync()) {
    return true;
  }

  router.navigateByUrl('/app/dashboard');
  return false;
};
