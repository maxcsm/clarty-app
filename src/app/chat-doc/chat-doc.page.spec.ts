import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatDocPage } from './chat-doc.page';

describe('ChatDocPage', () => {
  let component: ChatDocPage;
  let fixture: ComponentFixture<ChatDocPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChatDocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
