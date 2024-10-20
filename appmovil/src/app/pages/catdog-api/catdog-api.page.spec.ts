import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatdogApiPage } from './catdog-api.page';

describe('CatdogApiPage', () => {
  let component: CatdogApiPage;
  let fixture: ComponentFixture<CatdogApiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CatdogApiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
