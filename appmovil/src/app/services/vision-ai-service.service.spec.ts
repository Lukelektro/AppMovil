import { TestBed } from '@angular/core/testing';

import { VisionAiServiceService } from './vision-ai-service.service';

describe('VisionAiServiceService', () => {
  let service: VisionAiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisionAiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
