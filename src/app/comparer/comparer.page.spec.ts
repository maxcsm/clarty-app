import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparerPage } from './comparer.page';

describe('ComparerPage', () => {
  let component: ComparerPage;
  let fixture: ComponentFixture<ComparerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ComparerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
