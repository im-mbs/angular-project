import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { WallboardComponent } from './pages/wallboard/wallboard.component';
import { UsersComponent } from './pages/users/users.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { AgentReportComponent } from './pages/agentReport/agentReport.component';
import { ProductsComponent } from './pages/products/products.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { guestGuard } from './guards/guest-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutsComponent,
    children: [
      { path: 'wallboard', component: WallboardComponent },
      { path: 'charts', component: ChartsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'agent-queue-report', component: AgentReportComponent },
    ],
  },
  { path: '**', redirectTo: '/wallboard' },
];
