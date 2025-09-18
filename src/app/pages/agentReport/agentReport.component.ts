import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RequestHTTPService } from '../../services/request-http.service';
import { JalaliDatetimePickerComponent } from '../../widget/jalali-datetime-picker/jalali-datetime-picker.component';
import moment from 'jalali-moment';
import {
  FilterValue,
  GenericGridComponent,
  GridColumn,
} from '../../widget/generic-grid/generic-grid.component';

interface User {
  id: number;
  calldate: any;
  queue_name: any;
  agent: any;
  src: any;
  talk_time:any;
  wait_time:any;
  status:any;
}

@Component({
  selector: 'app-customers',
  imports: [
    JalaliDatetimePickerComponent,
    ReactiveFormsModule,
    GenericGridComponent,
  ],
  templateUrl: './agentReport.component.html',
  styleUrls: ['./agentReport.component.css'],
})
export class AgentReportComponent implements OnInit {
  agentForm!: FormGroup;
  data: any;
  users: User[] = [];
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' | '' = '';
  search = '';
  filters: FilterValue = {};
  columns: GridColumn<User>[] = [];
  loading: boolean = true;
  selectedUser: any = null;
  isEditMode = false;
  showModalDelete = false;

  constructor(
    private requestHTTPService: RequestHTTPService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchReport();
    this.initializeColumns();
  }

  private initForm() {
    const today = moment(); // امروز

    const threeMonthsAgo = today.clone().subtract(3, 'months');

    const startOfDay = moment(
      `${today.jDate()}-${
        today.jMonth() + 1
      }-${threeMonthsAgo.jYear()} 00:00:00`,
      'D-M-jYYYY HH:mm:ss'
    );

    // تاریخ پایان: امروز با ساعت 23:59:59
    const endOfDay = today.clone().endOf('day');

    this.agentForm = this.fb.group({
      start_date: new FormControl(startOfDay.format('jYYYY/jMM/jDD HH:mm:ss')),
      end_date: new FormControl(endOfDay.format('jYYYY/jMM/jDD HH:mm:ss')),
      agent: new FormControl('all'),
    });
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
    this.agentForm.controls[controlName].setValue(formattedDate);

    this.fetchReport()
  }

  get startDateControl(): FormControl {
    return this.agentForm.get('start_date') as FormControl;
  }

  get endDateControl(): FormControl {
    return this.agentForm.get('end_date') as FormControl;
  }

  fetchReport() {
    this.loading = true;
    const startGregorian = moment(
      this.agentForm.get('start_date')?.value,
      'jYYYY/jMM/jDD HH:mm:ss'
    ).format('YYYY-MM-DD HH:mm:ss');

    const endGregorian = moment(
      this.agentForm.get('end_date')?.value,
      'jYYYY/jMM/jDD HH:mm:ss'
    ).format('YYYY-MM-DD HH:mm:ss');

    // دقت کن که اینجا encodeURIComponent استفاده نشود
    const url = `report/user-call-logs?start_date=${startGregorian}&end_date=${endGregorian}&agent=${
      this.agentForm.get('agent')?.value
    }&page=1&per-page=10`;

    this.requestHTTPService.getRequest(url).subscribe((res) => {
      this.data = res.result.data.items;
      this.loading = false;
      console.log(this.data);
    });
  }

  initializeColumns(): void {
    this.columns = [
      {
        columnDef: 'calldate',
        header: 'تاریخ و زمان',
        cell: (data) => data.calldate || '',
        filterable: true,
        dataType: 'string',
      },
      {
        columnDef: 'queue_name',
        header: 'صف',
        cell: (user) => user.queue_name || '',
        filterable: true,
        dataType: 'string',
      },
      {
        columnDef: 'agent',
        header: 'اوپراتور',
        cell: (user) => user.agent || '',
        filterable: true,
        dataType: 'string',
      },
      {
        columnDef: 'src',
        header: 'منبع',
        cell: (user) => user.src || '',
        filterable: true,
        dataType: 'string',
      },
            {
        columnDef: 'wait_time',
        header: 'زمان انتظار(ثانیه)',
        cell: (user) => user.wait_time || '',
        filterable: true,
        dataType: 'string',
      },
            {
        columnDef: 'talk_time',
        header: 'زمان مکالمه',
        cell: (user) => user.talk_time || '',
        filterable: true,
        dataType: 'string',
      },
                  {
        columnDef: 'status',
        header: 'وضعیت تماس',
        cell: (user) => user.status || '',
        filterable: true,
        dataType: 'string',
      },
    ];
  }
}
