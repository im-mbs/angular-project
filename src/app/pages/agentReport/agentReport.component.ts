import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RequestHTTPService } from '../../services/request-http.service';
import { JalaliDatetimePickerComponent } from '../../widget/jalali-datetime-picker/jalali-datetime-picker.component';

@Component({
  selector: 'app-customers',
  imports: [JalaliDatetimePickerComponent, ReactiveFormsModule],
  templateUrl: './agentReport.component.html',
  styleUrls: ['./agentReport.component.css'],
})
export class AgentReportComponent implements OnInit {
  agentForm!: FormGroup;

  constructor(
    private requestHTTPService: RequestHTTPService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.agentForm = this.fb.group({
      agent: ['all'],
    });
  }
}
