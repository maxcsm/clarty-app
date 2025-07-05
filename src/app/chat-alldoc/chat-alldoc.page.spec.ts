import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAlldocPage } from './chat-alldoc.page';

describe('ChatAlldocPage', () => {
  let component: ChatAlldocPage;
  let fixture: ComponentFixture<ChatAlldocPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChatAlldocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
