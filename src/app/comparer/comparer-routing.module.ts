import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComparerPage } from './comparer.page';

const routes: Routes = [
  {
    path: '',
    component: ComparerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComparerPageRoutingModule {}
