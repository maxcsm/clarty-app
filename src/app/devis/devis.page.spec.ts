import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevisPage } from './devis.page';

describe('DevisPage', () => {
  let component: DevisPage;
  let fixture: ComponentFixture<DevisPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DevisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
