import { Component } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
}
