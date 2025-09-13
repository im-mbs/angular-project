import { Component, OnInit } from '@angular/core';
import moment from 'jalali-moment';

@Component({
  selector: 'app-date-time',
  imports: [],
  templateUrl: './date-time.component.html',
  styleUrl: './date-time.component.css',
})
export class DateTimeComponent implements OnInit{
  jalaliDateTime: string = '';

  ngOnInit(): void {
    this.startClock();
  }

  startClock() {
      setInterval(() => {
        // 'dddd، jD jMMMM jYYYY HH:mm' → بدون ثانیه، 24 ساعته
        this.jalaliDateTime = moment()
          .locale('fa')
          .format('dddd، jD jMMMM jYYYY [ساعت] HH:mm');
      }, 1000); // بروزرسانی هر ۱ ثانیه (برای تغییر دقیقه کافیست)
  
    };
}
