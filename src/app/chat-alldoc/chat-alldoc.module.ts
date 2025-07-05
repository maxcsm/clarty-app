import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatAlldocPageRoutingModule } from './chat-alldoc-routing.module';

import { ChatAlldocPage } from './chat-alldoc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatAlldocPageRoutingModule
  ],
  declarations: [ChatAlldocPage]
})
export class ChatAlldocPageModule {}
