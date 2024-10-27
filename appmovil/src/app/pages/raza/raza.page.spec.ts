import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RazaPage } from './raza.page';

describe('RazaPage', () => {
  let component: RazaPage;
  let fixture: ComponentFixture<RazaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RazaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
