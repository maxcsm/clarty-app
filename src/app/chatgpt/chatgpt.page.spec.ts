import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatgptPage } from './chatgpt.page';

describe('ChatgptPage', () => {
  let component: ChatgptPage;
  let fixture: ComponentFixture<ChatgptPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChatgptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
