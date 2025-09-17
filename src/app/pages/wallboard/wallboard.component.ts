import { Component, OnInit } from '@angular/core';
import { RequestHTTPService } from '../../services/request-http.service';
import { DateTimeComponent } from '../../widget/date-time/date-time.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-wallboard',
  imports: [DateTimeComponent , ReactiveFormsModule,],
  templateUrl: './wallboard.component.html',
  styleUrl: './wallboard.component.css',
})
export class WallboardComponent implements OnInit {
  data: any;
  wallboardform!: FormGroup;

  constructor(
    private requestHTTPService: RequestHTTPService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.fetchData();
  }

  private initForm() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    this.wallboardform = this.fb.group({
      start_date: [formatDate(yesterday)],
      end_time: [formatDate(today)],
      queue_name: ['queue-1'], // پیش‌فرض پشتیبانی فنی
      agent: ['all'],
    });
  }

  fetchData(){
    const body = this.wallboardform.value;
    this.requestHTTPService.postRequest('queues/queue-summery', body).subscribe(res => {
        console.log(res);
      });
  }
}
