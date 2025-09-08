import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RequestHTTPService } from './services/request-http.service';
import { LayoutsComponent } from './layouts/layouts.component';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  imports: [LayoutsComponent, LoginComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
 
}
