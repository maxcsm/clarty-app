import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAddressPageRoutingModule } from './my-address-routing.module';

import { MyAddressPage } from './my-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAddressPageRoutingModule
  ],
  declarations: [MyAddressPage]
})
export class MyAddressPageModule {}
