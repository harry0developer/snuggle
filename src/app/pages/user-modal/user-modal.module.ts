import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserModalPageRoutingModule } from './user-modal-routing.module';

import { UserModalPage } from './user-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserModalPageRoutingModule
  ],
  declarations: [UserModalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class UserModalPageModule {}
