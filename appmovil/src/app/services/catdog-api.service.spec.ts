import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar el módulo de pruebas de HttpClient
import { CatDogApiService } from './catdog-api.service';

describe('CatdogApiService', () => {
  let service: CatDogApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Agregar el HttpClientTestingModule
      providers: [CatDogApiService]
    });
    service = TestBed.inject(CatDogApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
