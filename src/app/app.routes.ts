import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'redirect-notification',
    loadComponent: () => import('./redirect-notification/redirect-notification.page').then( m => m.RedirectNotificationPage)
  },
];
