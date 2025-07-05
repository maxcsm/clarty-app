import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilePage } from './file.page';

describe('FilePage', () => {
  let component: FilePage;
  let fixture: ComponentFixture<FilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
