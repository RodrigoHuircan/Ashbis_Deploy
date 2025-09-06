import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth-routing-module').then(m => m.AUTH_ROUTES) // ⬅️ ojo al nombre exportado
  },
];