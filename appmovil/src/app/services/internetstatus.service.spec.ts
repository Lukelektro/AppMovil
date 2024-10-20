import { TestBed } from '@angular/core/testing';

import { InternetstatusService } from './internetstatus.service';

describe('InternetstatusService', () => {
  let service: InternetstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternetstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
