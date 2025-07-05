import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatAlldocPage } from './chat-alldoc.page';

const routes: Routes = [
  {
    path: '',
    component: ChatAlldocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatAlldocPageRoutingModule {}
