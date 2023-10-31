import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NetworkPage } from './network.page';
import { NetworkPageRoutingModule } from './network-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NetworkPageRoutingModule
  ],
  declarations: [NetworkPage]
})
export class NetworkPageModule {}
