import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    {path: '' , component: HomeComponent},
    {path: 'login' , component: LoginComponent},
    {path: 'contact' , component: ContactComponent},
    {path: 'about' , component: AboutComponent},
    {path: '**' , component: NotFoundComponent},
];
