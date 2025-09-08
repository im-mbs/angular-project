import { Component, inject } from '@angular/core';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { Router } from '@angular/router';
import { RequestHTTPService } from '../../services/request-http.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  error: string | null = null;
  router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private requestHTTPService: RequestHTTPService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmitted() {
    const loginData = this.loginForm.value
    this.requestHTTPService
      .postRequest('users/login', loginData
      )
      .subscribe({
        next: (res) => {
          console.log('Login successful:', res.result.token);
          const token = res.result.token;
          localStorage.setItem('auth_token' , token)
          this.router.navigate(['/home']); // بعد از لاگین به داشبورد برو
        },
        error: (err) => {
          this.error = 'Login failed. Please check your credentials.';
          console.error(err);
        },
      });
  }
}
