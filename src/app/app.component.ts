import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RequestHTTPService } from './services/request-http.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private requestHTTPService: RequestHTTPService) {}

  ngOnInit() {
    this.requestHTTPService.getUser().subscribe((data) => {
      console.log(data);
    });
  }
}
