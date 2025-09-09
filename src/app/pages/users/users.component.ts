import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RequestHTTPService } from '../../services/request-http.service';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, NgbModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  creatForm!: FormGroup;
  users: any[] = [];
  selectedUser: any = null;
  selectedUserId: number | null = null;

  constructor(
    private requestHTTPService: RequestHTTPService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.requestHTTPService.getRequest('users?perPage=100').subscribe({
      next: (data) => {
        const totalPages = data.result.data._meta.pageCount;
        const requests = [];
        for (let i = 1; i <= totalPages; i++) {
          requests.push(this.requestHTTPService.getRequest(`users?page=${i}`));
        }

        forkJoin(requests).subscribe({
          next: (responses) => {
            this.users = responses.flatMap((res: any) => res.result.data.items);
          },
          error: (error) => {
            console.error('Error fetching all users:', error);
          },
        });
      },
      error: (error) => {
        console.error('error fetching users: ', error);
      },
    });
  }

  private initForm() {
    this.creatForm = this.fb.group({
      enable: true,
      f_name: [''],
      l_name: [''],
      username: [''],
      email: [''],
      phone_number: [''],
      internal_number: [''],
      national_code: [''],
      gender: [''],
      role_name: [''],
      birth_date: [''],
      date_employed: [''],
      password: ['123456'],
      internal_number_type: 1,
    });
  }

  onReset(): void {
    this.creatForm.reset({
      gender: '',
      role_name: '',
    });
  }


 onCreate() {
  const formData = { ...this.creatForm.value };

  if (!this.selectedUserId) {
    // اضافه کردن password برای ساخت کاربر جدید
    formData.password = '123456'; // یا هر مقدار پیش‌فرض که میخواید
    formData.internal_number_type = 1;
  }

  if (this.selectedUserId) {
    // ویرایش
    const body = { id: this.selectedUserId, ...formData };
    this.requestHTTPService.postRequest('users/update-user', body)
      .subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.id === this.selectedUserId);
          if (index !== -1) this.users[index] = { id: this.selectedUserId, ...formData };
          this.ngOnInit();
          this.creatForm.reset();
          this.selectedUserId = null;
        },
        error: (error) => console.error('Error updating user:', error)
      });
  } else {
    // ایجاد کاربر جدید
    this.requestHTTPService.postRequest('users/create-user', formData)
      .subscribe({
        next: (response: any) => {
          const newUser = response.result.data;
          this.users.push(newUser);
          this.ngOnInit()
          this.creatForm.reset();
        },
        error: (error) => console.error('Error creating user:', error)
      });
  }
}


  onEdit(user: any): void {
    this.selectedUserId = Number(user.id);
    this.selectedUser = user;

    this.creatForm.patchValue({
      f_name: user.f_name,
      l_name: user.l_name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      internal_number: user.internal_number,
      national_code: user.national_code,
      gender: user.gender,
      role_name: user.role_name,
      birth_date: user.birth_date,
      date_employed: user.date_employed,
      enable: user.enable,
      internal_number_type: user.internal_number_type,
    });
  }

  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  openDeleteModal(user: any, modalContent: any) {
    this.selectedUserId = Number(user.id);
    this.selectedUser = user;
    this.modalService.open(modalContent);
  }

  confirmDelete(modal: any): void {
    if (this.selectedUserId !== null) {
      this.requestHTTPService
        .deleteRequest(`users/delete-user`, this.selectedUserId)
        .subscribe({
          next: () => {
            // حذف کاربر از لیست محلی
            this.users = this.users.filter((u) => u.id !== this.selectedUserId);
            modal.close();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            modal.dismiss();
          },
        });
    }
  }
}
