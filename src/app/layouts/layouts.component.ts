import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-layouts',
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
],
  templateUrl: './layouts.component.html',
  styleUrl: './layouts.component.css',
})
export class LayoutsComponent {}
