import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

import { Dashboard } from './pages/dashboard/dashboard';
import { ActivitiesList } from './pages/activities/activities-list';
import { ActivityForm } from './pages/activities/activity-form';
import { TemplatesList } from './pages/templates/templates-list';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './shared/guards/auth-guard';
import { guestGuard } from './shared/guards/guest-guard';
import { EditProfilePage } from './pages/profile/edit-profile';
import { AdminPage } from './pages/admin/admin-page';
import { adminGuard } from './shared/guards/admin-guard';

export const routes: Routes = [
  // públicas
  { path: '', component: Landing },
  { path: 'auth/login', component: Login, canActivate: [guestGuard] },
  { path: 'auth/register', component: Register, canActivate: [guestGuard] },

  // privadas (prefijo /app)
  { path: 'app/dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'app/activities', component: ActivitiesList, canActivate: [authGuard] },
  { path: 'app/activities/new', component: ActivityForm, canActivate: [authGuard] },
  { path: 'app/activities/:id/edit', component: ActivityForm, canActivate: [authGuard] },
  { path: 'app/templates', component: TemplatesList, canActivate: [authGuard] },
  { path: 'app/profile', component: EditProfilePage, canActivate: [authGuard] },

  // admin
  {
    path: 'app/admin',
    component: AdminPage,
    canActivate: [authGuard, adminGuard]
  },

  // 404
  { path: '**', component: NotFound }
];