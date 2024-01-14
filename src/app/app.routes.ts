import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', loadChildren: () => import('./modules/main/main.routes').then(r => r.mainRoutes)},
  {path: 'auth', loadChildren: () => import('./modules/auth/auth.routes').then(r => r.authRoutes)},
];
