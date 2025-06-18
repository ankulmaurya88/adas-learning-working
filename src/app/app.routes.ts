import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '',
    component: HomeComponent,
    title: 'ADAS Simulation Dashboard'
  },

  
  // { path: 'dashboard', component: DashboardComponent},
];
