import { TestBed } from '@angular/core/testing';

import { SincronizarStorageService } from './sincronizar-storage.service';

describe('SincronizarStorageService', () => {
  let service: SincronizarStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SincronizarStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
