import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { ProductsComponent } from './pages/products/products.component';
import { ChartsComponent } from './pages/charts/charts.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutsComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'charts', component: ChartsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'products', component: ProductsComponent},
      { path: 'customers', component: CustomersComponent },
      { path: 'home', component: HomeComponent },
    ],
  },
  { path: '**', redirectTo: '/home' },
];
