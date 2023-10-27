import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InternetPageRoutingModule } from './internet-routing.module';

import { InternetPage } from './internet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InternetPageRoutingModule
  ],
  declarations: [InternetPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class InternetPageModule {}
