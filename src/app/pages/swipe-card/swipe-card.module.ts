import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwipeCardPage } from './swipe-card.page';
import { IonicModule } from '@ionic/angular';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SwipeCardPageModule
  ],
  declarations: [SwipeCardPage]
})
export class SwipeCardPageModule {}
