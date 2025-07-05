import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComparerPageRoutingModule } from './comparer-routing.module';

import { ComparerPage } from './comparer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComparerPageRoutingModule
  ],
  declarations: [ComparerPage]
})
export class ComparerPageModule {}
