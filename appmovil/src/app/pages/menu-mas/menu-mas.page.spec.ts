import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuMasPage } from './menu-mas.page';

describe('MenuMasPage', () => {
  let component: MenuMasPage;
  let fixture: ComponentFixture<MenuMasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
