import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatgptOpenaiPage } from './chatgpt-openai.page';

const routes: Routes = [
  {
    path: '',
    component: ChatgptOpenaiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatgptOpenaiPageRoutingModule {}
