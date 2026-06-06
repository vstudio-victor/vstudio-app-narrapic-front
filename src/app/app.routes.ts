import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/landing/landing').then((m) => m.LandingComponent),
  },

  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/create/create').then((m) => m.CreateComponent),
      },
      {
        path: 'results',
        loadComponent: () => import('./pages/results/results').then((m) => m.ResultsComponent),
      },
      {
        path: 'download',
        loadComponent: () => import('./pages/download/download').then((m) => m.DownloadComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects').then((m) => m.ProjectsComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.SettingsComponent),
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import('./pages/subscription/subscription').then((m) => m.SubscriptionComponent),
      },
      {
        path: 'my-captions',
        loadComponent: () =>
          import('./pages/user-captions/captions').then((m) => m.CaptionsComponent),
      },
    ],
  },

  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing').then((m) => m.PricingComponent),
  },

  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/auth/signup/signup').then((m) => m.SignupComponent),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
