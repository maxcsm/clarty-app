import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatDocPageRoutingModule } from './chat-doc-routing.module';

import { ChatDocPage } from './chat-doc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatDocPageRoutingModule
  ],
  declarations: [ChatDocPage]
})
export class ChatDocPageModule {}
