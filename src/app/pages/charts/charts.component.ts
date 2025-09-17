import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RequestHTTPService } from '../../services/request-http.service';
import moment from 'jalali-moment';
import { JalaliDatetimePickerComponent } from '../../widget/jalali-datetime-picker/jalali-datetime-picker.component';
import { NgClass } from '@angular/common';
import { DateTimeComponent } from '../../widget/date-time/date-time.component';
import { CreateChartComponent } from '../../widget/create-chart/create-chart.component';

@Component({
  standalone: true,
  selector: 'app-charts',
  imports: [
    ReactiveFormsModule,
    JalaliDatetimePickerComponent,
    NgClass,
    DateTimeComponent,
    CreateChartComponent,
  ],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  chartForm!: FormGroup;
  data: any;
  activePeriod: string = 'quarterly';

  constructor(
    private requestHTTPService: RequestHTTPService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setDefaultPeriod(); // مقداردهی پیش‌فرض فصلی
    this.fetchData();
  }

  private initForm() {
    this.chartForm = this.fb.group({
      start_date: [''],
      end_time: [''],
      queue_name: ['queue-1'], // پیش‌فرض پشتیبانی
      period: 'quarterly',
    });
  }

  // مقداردهی پیش‌فرض فصلی و نمایش در اینپوت‌ها
  private setDefaultPeriod() {
    const today = moment();
    const start = today.clone().subtract(3, 'months'); // 3 ماه قبل برای فصلی، روز همان امروز

    const startDate = start.locale('fa').format('jYYYY/jMM/jDD');
    const endDate = today.locale('fa').format('jYYYY/jMM/jDD');

    this.chartForm.patchValue({
      period: 'quarterly',
      start_date: startDate,
      end_time: endDate,
    });

    this.activePeriod = 'quarterly';
  }

  // تغییر دوره با دکمه‌ها
  setPeriod(period: string) {
    this.activePeriod = period;

    const today = moment();
    let start: moment.Moment;

    switch (period) {
      case 'daily':
        start = today.clone().subtract(1, 'days');
        break;
      case 'weekly':
        start = today.clone().subtract(7, 'days');
        break;
      case 'monthly':
        start = today.clone().subtract(1, 'months'); // 1 ماه قبل، روز همان امروز
        break;
      case 'quarterly':
        start = today.clone().subtract(3, 'months'); // 3 ماه قبل، روز همان امروز
        break;
      default:
        start = today.clone();
    }

    const startDate = start.locale('fa').format('jYYYY/jMM/jDD');
    const endDate = today.locale('fa').format('jYYYY/jMM/jDD');

    this.chartForm.patchValue({
      period,
      start_date: startDate,
      end_time: endDate,
    });

    this.fetchData();
  }

  onDateSelected(controlName: string, jalaliDate: any) {
  let formattedDate: string;

  if (jalaliDate.format) {
    // Moment جلالی
    formattedDate = jalaliDate.format('jYYYY/jMM/jDD'); // فقط تاریخ جلالی
  } else {
    // فرض بر این است که رشته است
    formattedDate = jalaliDate;
  }

  // ذخیره فقط تاریخ بدون ساعت در فرم
  this.chartForm.controls[controlName].setValue(formattedDate);

  // دوره را به custom تغییر بده
  this.chartForm.patchValue({ period: 'custom' });
  this.activePeriod = 'custom';

  // تبدیل به میلادی بدون ساعت برای ارسال به سرور
  const gregorianDate = moment(formattedDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');

  this.fetchData();
}

  fetchData() {
    let body: any;

    // اگر period custom است، تمام فیلدها را ارسال کن
    if (this.chartForm.value.period === 'custom') {
      body = { ...this.chartForm.value };

      if (body.start_date) {
        body.start_date = moment(body.start_date, 'jYYYY/jMM/jDD').format(
          'YYYY-MM-DD'
        );
      }
      if (body.end_time) {
        body.end_time = moment(body.end_time, 'jYYYY/jMM/jDD').format(
          'YYYY-MM-DD'
        );
      }
    } else {
      // برای هر دوره‌ای غیر از custom فقط period را ارسال کن
      body = { period: this.chartForm.value.period };
    }

    this.requestHTTPService
      .postRequest('queues/queue-wallboard', body)
      .subscribe({
        next: (response) => {
          this.data = response;
          console.log(this.data);
        },
        error: (err) => {
          console.error('❌ خطا:', err);
        },
      });
  }

  get startDateControl(): FormControl {
    return this.chartForm.get('start_date') as FormControl;
  }

  get endDateControl(): FormControl {
    return this.chartForm.get('end_time') as FormControl;
  }
}
