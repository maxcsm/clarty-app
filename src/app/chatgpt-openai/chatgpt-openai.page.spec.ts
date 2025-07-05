import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatgptOpenaiPage } from './chatgpt-openai.page';

describe('ChatgptOpenaiPage', () => {
  let component: ChatgptOpenaiPage;
  let fixture: ComponentFixture<ChatgptOpenaiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChatgptOpenaiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
