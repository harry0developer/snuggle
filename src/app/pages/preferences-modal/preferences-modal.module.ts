import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PreferencesModalPage } from './preferences-modal.page';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [PreferencesModalPage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PreferencesModalPageModule {}
