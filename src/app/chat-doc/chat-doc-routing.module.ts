import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatDocPage } from './chat-doc.page';

const routes: Routes = [
  {
    path: '',
    component: ChatDocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatDocPageRoutingModule {}
