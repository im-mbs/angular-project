import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RequestHTTPService } from './services/request-http.service';
import { LayoutsComponent } from './layouts/layouts.component';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  imports: [LayoutsComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  users:any[] = [];
  error:string | null = null
  constructor(private requestHTTPService: RequestHTTPService) {}

  ngOnInit():void {
  //   this.requestHTTPService.getUser().subscribe({
  //     next:(data) => {
  //       this.users = data;
  //       this.error = null;
  //     },
  //     error:(err) =>{
  //       this.error = err.message;
  //       console.log('Error in component :' , this.error);
  //     }
  //   });
  // }
  }
}
