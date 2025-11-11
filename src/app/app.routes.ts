import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

import { Dashboard } from './pages/dashboard/dashboard';
import { ActivitiesList } from './pages/activities/activities-list';
import { ActivityForm } from './pages/activities/activity-form';
import { TemplatesList } from './pages/templates/templates-list';
import { NotificationsPage } from './pages/notifications/notifications';
import { NotFound } from './pages/not-found/not-found';

// Guard (mock) basado en localStorage
export const authGuard: CanActivateFn = () => {
  const has = !!localStorage.getItem('token');
  if (!has) {
    const r = inject(Router);
    r.navigateByUrl('/auth/login');
  }
  return has;
};

export const routes: Routes = [
  // públicas
  { path: '', component: Landing },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },

  // privadas (prefijo /app)
  { path: 'app/dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'app/activities', component: ActivitiesList, canActivate: [authGuard] },
  { path: 'app/activities/new', component: ActivityForm, canActivate: [authGuard] },
  { path: 'app/templates', component: TemplatesList, canActivate: [authGuard] },
  { path: 'app/notifications', component: NotificationsPage, canActivate: [authGuard] },

  // 404
  { path: '**', component: NotFound }
];
