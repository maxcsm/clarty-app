import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatgptOpenaiPageRoutingModule } from './chatgpt-openai-routing.module';

import { ChatgptOpenaiPage } from './chatgpt-openai.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatgptOpenaiPageRoutingModule
  ],
  declarations: [ChatgptOpenaiPage]
})
export class ChatgptOpenaiPageModule {}
