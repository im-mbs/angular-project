import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
} from 'chart.js';
import { RequestHTTPService } from '../../services/request-http.service';
import moment from 'jalali-moment';
import { JalaliDatetimePickerComponent } from '../../widget/jalali-datetime-picker/jalali-datetime-picker.component';
import { NgClass } from '@angular/common';
import { DateTimeComponent } from '../../widget/date-time/date-time.component';

Chart.register(
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

@Component({
  standalone: true,
  selector: 'app-charts',
  imports: [ReactiveFormsModule, JalaliDatetimePickerComponent , NgClass , DateTimeComponent],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  barChart: Chart | null = null;
  chartForm!: FormGroup;
  data: any;
  activePeriod: string = 'daily';

  constructor(
    private requestHTTPService: RequestHTTPService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchData();
  }

  private initForm() {
    this.chartForm = this.fb.group({
      start_date: [''],
      end_time: [''],
      queue_name: ['queue-1'],
      period: 'quarterly',
    });
  }
  
  setPeriod(period: string) {
    this.activePeriod = period;
    this.chartForm.patchValue({ period, start_date: '', end_time: '' }); // تاریخ‌ها ریست می‌شوند
    this.fetchData();
  }

  onDateSelected(controlName: string, jalaliDate: string) {
    // اگر کاربر تاریخ انتخاب کند، period به custom تغییر می‌کند
    this.chartForm.controls[controlName].setValue(jalaliDate);
    this.chartForm.patchValue({ period: 'custom' });
  }

  fetchData() {
    const body = { ...this.chartForm.value };

    // اگر period = custom بود باید تاریخ‌ها را تبدیل کنیم
    if (body.period === 'custom') {
      if (body.start_date) {
        body.start_date = moment(body.start_date, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
      }
      if (body.end_time) {
        body.end_time = moment(body.end_time, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
      }
    }

    console.log('📤 ارسال درخواست:', body);

    this.requestHTTPService
      .postRequest('queues/queue-wallboard', body)
      .subscribe({
        next: (response) => {
          console.log('✅ پاسخ سرور:', response);
          this.data = response.result.queues[0];
          this.createBarChart(this.data);
        },
        error: (err) => {
          console.error('❌ خطا در گرفتن داده‌ها:', err);
        },
      });
  }

  get startDateControl(): FormControl {
    return this.chartForm.get('start_date') as FormControl;
  }

  get endDateControl(): FormControl {
    return this.chartForm.get('end_time') as FormControl;
  }

  createBarChart(data: any) {
    if (this.barChart) {
      this.barChart.destroy(); // جلوگیری از دوباره‌سازی
    }

    // پیدا کردن بیشترین مقدار داده‌ها
    const values = [
      data.abandoned_calls,
      data.unanswered_calls,
      data.answered_calls,
      data.total_calls,
    ];
    const maxValue = Math.max(...values);

    // محاسبه هوشمند yAxisMax و stepSize
    const padding = Math.ceil(maxValue * 0.1); // 10% فضای اضافه
    let yAxisMax = maxValue + padding;

    // گرد کردن به نزدیک‌ترین رقم دهگان/صدگان برای نمایش تمیز
    const magnitude = Math.pow(10, Math.floor(Math.log10(yAxisMax)));
    yAxisMax = Math.ceil(yAxisMax / magnitude) * magnitude;

    // تعیین stepSize بر اساس تعداد تیک‌ها بین 4 تا 10
    const stepSize = Math.ceil(yAxisMax / 5 / magnitude) * magnitude || 1;

    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['ترک صف', 'پاسخ نداده', 'پاسخ داده شده', 'کل تماس‌ها'],
        datasets: [
          {
            label: `صف : ${this.data.queue_name}`,
            data: values,
            backgroundColor: ['#f87171', '#fbbf24', '#34d399', '#60a5fa'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              generateLabels: (chart) => {
                return chart.data.datasets.map((dataset, i) => ({
                  text: dataset.label || '',
                  fillStyle: 'transparent',
                  strokeStyle: 'transparent',
                  lineWidth: 0,
                  hidden: false,
                  datasetIndex: i,
                }));
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: yAxisMax,
            ticks: {
              stepSize: stepSize,
            },
          },
        },
      },
    });
  }
}
