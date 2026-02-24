import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'feed' },

  {
    path: '',
    loadComponent: () => import('./core/layout/shell/shell').then((m) => m.Shell),
    // children: [
    //   {
    //     path: 'feed',
    //     canActivate: [authGuard],
    //     loadComponent: () =>
    //       import('./features/feed/pages/feed-page.component').then((m) => m.FeedPageComponent),
    //   },
    //   {
    //     path: 'profile',
    //     canActivate: [authGuard],
    //     loadComponent: () =>
    //       import('./features/profile/pages/profile-page.component').then(
    //         (m) => m.ProfilePageComponent
    //       ),
    //   },
    // ],
  },

//   {
//     path: 'login',
//     loadComponent: () => import('./core/auth/pages/login-page.component').then((m) => m.LoginPageComponent),
//   },
//   {
//     path: 'auth/callback',
//     loadComponent: () =>
//       import('./core/auth/pages/auth-callback-page.component').then((m) => m.AuthCallbackPageComponent),
//   },

  { path: '**', redirectTo: 'feed' },
];