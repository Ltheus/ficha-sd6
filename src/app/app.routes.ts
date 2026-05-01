import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'ficha', pathMatch: 'full' },
  {
    path: 'ficha',
    loadComponent: () =>
      import('./features/ficha/ficha.component').then(m => m.FichaComponent),
  },
];
