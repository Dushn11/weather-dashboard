import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Map } from './pages/map/map';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'map', component: Map },
  { path: 'settings', component: Settings },
  { path: '**', redirectTo: '/dashboard' }
];
