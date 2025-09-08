import { Component } from '@angular/core';
import { MainComponent } from '../../layouts/main/main.component';
import { FooterComponent } from '../../layouts/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [MainComponent , FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
