import { Component, OnInit } from '@angular/core';
import { RequestHTTPService } from '../../services/request-http.service';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common'; 

@Component({
  selector: 'app-users',
  imports: [NgIf, NgFor],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: any = [];

  constructor(private requestHTTPService: RequestHTTPService) {}

  getUsers(): void{
    this.requestHTTPService.getRequest('users').subscribe({
      next: (data) => {
        this.users = data.result.data.items;
        console.log(this.users);
      },
      error: (error) => {
        console.error('error fetching users: ' , error)
      }
    });
  }

}
