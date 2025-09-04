import { TestBed } from '@angular/core/testing';

import { RequestHTTPService } from './request-http.service';

describe('RequestHTTPService', () => {
  let service: RequestHTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestHTTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
